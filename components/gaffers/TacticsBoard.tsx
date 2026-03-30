"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/tactics-store";

// ─── Quadrant config ────────────────────────────────────────────────────────
const QUADRANTS: {
  id: 1 | 2 | 3 | 4;
  label: string;
  sub: string;
  axes: string;
  accent: string;
  bg: string;
}[] = [
  {
    id: 1,
    label: "First Team",
    sub: "Do Now",
    axes: "Urgent · Important",
    accent: "#B22222",
    bg: "rgba(139,26,26,0.12)",
  },
  {
    id: 2,
    label: "Training Ground",
    sub: "Schedule It",
    axes: "Not Urgent · Important",
    accent: "#C9933A",
    bg: "rgba(201,147,58,0.10)",
  },
  {
    id: 3,
    label: "The Bench",
    sub: "Delegate It",
    axes: "Urgent · Not Important",
    accent: "#4A7C6F",
    bg: "rgba(74,124,111,0.10)",
  },
  {
    id: 4,
    label: "Released",
    sub: "Drop It",
    axes: "Not Urgent · Not Important",
    accent: "#5A5A6A",
    bg: "rgba(90,90,106,0.10)",
  },
];

// ─── Ghost chip (shown inside DragOverlay while dragging) ────────────────────
function GhostChip({ task, accent }: { task: Task; accent: string }) {
  return (
    <div
      className="flex items-start gap-2 rounded px-3 py-2 text-sm shadow-2xl"
      style={{
        background: "rgba(20,20,24,0.95)",
        border: `1px solid ${accent}70`,
        backdropFilter: "blur(8px)",
        opacity: 0.95,
        cursor: "grabbing",
        minWidth: 160,
        maxWidth: 280,
      }}
    >
      <span className="mt-[3px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
      <span className="flex-1 font-[var(--font-body)] text-[var(--color-text-primary)] text-[13px] leading-snug">
        {task.text}
      </span>
    </div>
  );
}

// ─── Single task chip (draggable) ────────────────────────────────────────────
function TaskChip({
  task,
  accent,
  onDelete,
  isDragging,
}: {
  task: Task;
  accent: string;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      ref={setNodeRef}
      style={{ ...style, background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}30` }}
      className="group flex items-start gap-2 rounded px-3 py-2 text-sm touch-none"
      {...attributes}
    >
      {/* Drag handle */}
      <span
        {...listeners}
        className="mt-[3px] shrink-0 flex flex-col gap-[3px] pt-[1px] cursor-grab active:cursor-grabbing"
        title="Drag to move"
      >
        <span className="block w-2.5 h-[1.5px] rounded-full" style={{ background: accent, opacity: 0.6 }} />
        <span className="block w-2.5 h-[1.5px] rounded-full" style={{ background: accent, opacity: 0.6 }} />
        <span className="block w-2.5 h-[1.5px] rounded-full" style={{ background: accent, opacity: 0.6 }} />
      </span>

      <span className="flex-1 font-[var(--font-body)] text-[var(--color-text-primary)] text-[13px] leading-snug">
        {task.text}
      </span>

      {/* Delete — shown on hover */}
      <button
        title="Remove"
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 ml-0.5 text-[var(--color-text-secondary)] hover:text-[#B22222] transition-opacity text-[11px] shrink-0"
      >
        ✕
      </button>
    </motion.div>
  );
}



// ─── Quadrant panel (droppable) ──────────────────────────────────────────────
function QuadrantPanel({
  q,
  tasks,
  activeId,
  onAdd,
  onDelete,
}: {
  q: (typeof QUADRANTS)[number];
  tasks: Task[];
  activeId: string | null;
  onAdd: (quadrant: Task["quadrant"], text: string) => void;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: q.id });
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(q.id, trimmed);
    setDraft("");
  }

  const isDropTarget = isOver && activeId !== null;

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col gap-3 rounded-lg p-4 min-h-[220px] transition-all duration-150"
      style={{
        background: isDropTarget ? `${q.bg.replace("0.10", "0.22").replace("0.12", "0.28")}` : q.bg,
        border: `1px solid ${isDropTarget ? q.accent + "80" : q.accent + "30"}`,
        boxShadow: isDropTarget ? `0 0 0 2px ${q.accent}30, inset 0 0 24px ${q.accent}08` : "none",
      }}
    >
      {/* Header */}
      <div className="pb-2" style={{ borderBottom: `1px solid ${q.accent}25` }}>
        <p
          className="font-[var(--font-display)] text-lg font-bold uppercase tracking-wide"
          style={{ color: q.accent }}
        >
          {q.label}
        </p>
        <p className="font-[var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase mt-0.5">
          {q.sub} · {q.axes}
        </p>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 flex-1">
        <AnimatePresence mode="popLayout">
          {tasks.map((t) => (
            <TaskChip
              key={t.id}
              task={t}
              accent={q.accent}
              onDelete={onDelete}
              isDragging={activeId === t.id}
            />
          ))}
        </AnimatePresence>

        {/* Drop hint */}
        {isDropTarget && (
          <div
            className="rounded border-dashed border flex items-center justify-center py-3"
            style={{ borderColor: `${q.accent}50`, color: `${q.accent}80` }}
          >
            <span className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase">
              Drop here
            </span>
          </div>
        )}
      </div>

      {/* Add input */}
      <div className="flex gap-2 mt-auto pt-2" style={{ borderTop: `1px solid ${q.accent}20` }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a task…"
          className="flex-1 bg-transparent text-[13px] font-[var(--font-body)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none"
          style={{ borderBottom: `1px solid ${q.accent}40`, paddingBottom: "2px" }}
        />
        <button
          onClick={submit}
          className="font-[var(--font-mono)] text-[10px] tracking-widest uppercase transition-opacity hover:opacity-80 px-1"
          style={{ color: q.accent }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

// ─── Main TacticsBoard ───────────────────────────────────────────────────────
export default function TacticsBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Require 4px movement before drag starts — prevents accidental drags on click
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const addTask = useCallback(async (quadrant: Task["quadrant"], text: string) => {
    const res = await fetch("/api/tactics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, quadrant }),
    });
    if (!res.ok) { setError("Failed to add task"); return; }
    const task: Task = await res.json();
    setTasks((prev) => [...prev, task]);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`/api/tactics/${id}`, { method: "DELETE" });
    if (!res.ok) { setError("Failed to delete task"); return; }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback(async (id: string, quadrant: Task["quadrant"]) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, quadrant } : t)));
    const res = await fetch(`/api/tactics/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quadrant }),
    });
    if (!res.ok) {
      setError("Failed to move task");
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, quadrant: t.quadrant } : t)));
    }
  }, []);

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(String(active.id));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;

    const taskId = String(active.id);
    const targetQuadrant = Number(over.id) as Task["quadrant"];
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.quadrant === targetQuadrant) return;
    moveTask(taskId, targetQuadrant);
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;
  const activeTaskAccent = activeTask
    ? QUADRANTS.find((q) => q.id === activeTask.quadrant)?.accent ?? "#C9933A"
    : "#C9933A";

  return (
    <DndContext id="tactics-board" sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full">
        {error && (
          <p className="text-center text-sm text-[#B22222] mb-4 font-[var(--font-mono)]">{error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUADRANTS.map((q) => (
            <QuadrantPanel
              key={q.id}
              q={q}
              tasks={tasks.filter((t) => t.quadrant === q.id)}
              activeId={activeId}
              onAdd={addTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>

      {/* Floating ghost shown while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? <GhostChip task={activeTask} accent={activeTaskAccent} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
