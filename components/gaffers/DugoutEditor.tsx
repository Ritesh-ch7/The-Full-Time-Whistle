"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  ClipboardEvent,
  ChangeEvent,
  KeyboardEvent,
  useLayoutEffect,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { Block, BlockType, DugoutPage } from "@/lib/dugout-store";

// ── Slash-command menu items ─────────────────────────────────────────────────
const SLASH_COMMANDS: { type: BlockType; label: string; description: string; icon: string }[] = [
  { type: "text",      label: "Text",      description: "Plain paragraph",            icon: "¶"  },
  { type: "heading1",  label: "Heading 1", description: "Large section heading",      icon: "H1" },
  { type: "heading2",  label: "Heading 2", description: "Medium section heading",     icon: "H2" },
  { type: "bullet",    label: "Bullet",    description: "Unordered list item",        icon: "•"  },
  { type: "checklist", label: "Checklist", description: "Toggle-able to-do item",     icon: "☑" },
  { type: "image",     label: "Image",     description: "Paste or upload an image",   icon: "🖼" },
  { type: "divider",   label: "Divider",   description: "Horizontal rule separator",  icon: "—"  },
  { type: "code",      label: "Code",      description: "Monospace code snippet",     icon: "<>" },
];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const UNTITLED_TITLE = "Untitled page";

// ── Helpers ──────────────────────────────────────────────────────────────────
function newBlock(type: BlockType = "text"): Block {
  return { id: crypto.randomUUID(), type, content: "", checked: false };
}

function newClientPage(title = "Untitled page"): DugoutPage {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    blocks: [newBlock("text")],
    createdAt: now,
    updatedAt: now,
  };
}

function isUntitledTitle(title: string): boolean {
  return title.trim().toLowerCase() === UNTITLED_TITLE.toLowerCase();
}

function deriveTitleFromBlocks(blocks: Block[]): string {
  const heading = blocks.find((block) =>
    (block.type === "heading1" || block.type === "heading2") && block.content.trim().length > 0
  );
  if (heading) return heading.content.trim().slice(0, 80);

  const firstText = blocks.find((block) => block.content.trim().length > 0);
  if (firstText) return firstText.content.trim().slice(0, 80);

  return UNTITLED_TITLE;
}

function formatCreatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "Created recently";
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });
}

// ── Block renderer ───────────────────────────────────────────────────────────
function BlockRow({
  block,
  isFocused,
  activeId,
  slashQuery,
  onContentChange,
  onKeyDown,
  onFocus,
  onCheckToggle,
  onRemove,
  onRequestImageAttach,
  onPasteImage,
  onMenuSelect,
  onMenuClose,
  inputRef,
}: {
  block: Block;
  isFocused: boolean;
  activeId: string | null;
  slashQuery: string;
  onContentChange: (id: string, val: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>, id: string) => void;
  onFocus: (id: string) => void;
  onCheckToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onRequestImageAttach: (id: string) => void;
  onPasteImage: (id: string, file: File) => void;
  onMenuSelect: (id: string, type: BlockType) => void;
  onMenuClose: () => void;
  inputRef: (el: HTMLElement | null) => void;
}) {
  const showMenu = isFocused && activeId === block.id && slashQuery !== null;

  const handlePaste = (e: ClipboardEvent<HTMLElement>) => {
    const file = Array.from(e.clipboardData.files).find((item) => item.type.startsWith("image/"));
    if (!file) return;
    e.preventDefault();
    onPasteImage(block.id, file);
  };

  if (block.type === "divider") {
    return (
      <div className="py-3 relative group">
        <hr className="border-0 h-px" style={{ background: "rgba(201,147,58,0.25)" }} />
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[var(--color-text-secondary)] hover:text-[#B22222] text-[11px] transition-opacity px-1"
          onMouseDown={(e) => {
            e.preventDefault();
            onRemove(block.id);
          }}
        >✕</button>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="relative group my-4">
        {block.content ? (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(201,147,58,0.18)", background: "rgba(0,0,0,0.35)" }}
          >
            <Image
              src={block.content}
              alt="Attached note"
              width={1600}
              height={900}
              className="w-full max-h-[460px] object-contain"
              unoptimized
            />
          </div>
        ) : (
          <button
            onClick={() => onRequestImageAttach(block.id)}
            className="w-full rounded-lg border border-dashed px-4 py-8 text-center transition-colors"
            style={{
              borderColor: "rgba(201,147,58,0.35)",
              color: "var(--color-text-secondary)",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            Click to upload an image
          </button>
        )}

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onRequestImageAttach(block.id)}
            className="text-[10px] px-2 py-1 rounded font-[var(--font-mono)] tracking-[0.14em] uppercase"
            style={{ background: "rgba(10,10,10,0.78)", color: "#F0EDE6", border: "1px solid rgba(201,147,58,0.3)" }}
          >
            Replace
          </button>
          <button
            onClick={() => onRemove(block.id)}
            className="text-[10px] px-2 py-1 rounded font-[var(--font-mono)] tracking-[0.14em] uppercase"
            style={{ background: "rgba(10,10,10,0.78)", color: "#F0EDE6", border: "1px solid rgba(178,34,34,0.45)" }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "checklist") {
    return (
      <div className="flex items-start gap-2 group relative py-0.5">
        <button
          onMouseDown={(e) => { e.preventDefault(); onCheckToggle(block.id); }}
          className="mt-[3px] shrink-0 w-[16px] h-[16px] rounded flex items-center justify-center transition-colors border"
          style={{
            background: block.checked ? "#C9933A" : "transparent",
            borderColor: block.checked ? "#C9933A" : "rgba(201,147,58,0.4)",
          }}
        >
          {block.checked && <span className="text-[9px] text-[#0A0A0A] font-bold leading-none">✓</span>}
        </button>
        <div
          ref={(node) => inputRef(node)}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onContentChange(block.id, (e.currentTarget as HTMLDivElement).innerText)}
          onKeyDown={(e) => onKeyDown(e, block.id)}
          onPaste={handlePaste}
          onFocus={() => onFocus(block.id)}
          className="flex-1 outline-none font-[var(--font-body)] text-[14px] leading-relaxed min-h-[1.5em] transition-colors"
          style={{
            color: block.checked ? "var(--color-text-secondary)" : "var(--color-text-primary)",
            textDecoration: block.checked ? "line-through" : "none",
          }}
          data-placeholder="To-do item…"
        />
        {showMenu && (
          <div className="absolute left-6 top-full">
            <SlashMenu key={slashQuery} query={slashQuery.slice(1)} onSelect={(t) => onMenuSelect(block.id, t)} onClose={onMenuClose} />
          </div>
        )}
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div className="relative group my-1">
        <pre
          ref={(node) => inputRef(node)}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onContentChange(block.id, (e.currentTarget as HTMLPreElement).innerText)}
          onKeyDown={(e) => onKeyDown(e, block.id)}
          onPaste={handlePaste}
          onFocus={() => onFocus(block.id)}
          className="w-full outline-none rounded-md px-4 py-3 font-[var(--font-mono)] text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap"
          style={{ background: "rgba(0,0,0,0.45)", color: "#98C379", border: "1px solid rgba(201,147,58,0.15)" }}
          data-placeholder="// code here…"
        />
        {showMenu && (
          <div className="absolute left-0 top-full">
            <SlashMenu key={slashQuery} query={slashQuery.slice(1)} onSelect={(t) => onMenuSelect(block.id, t)} onClose={onMenuClose} />
          </div>
        )}
      </div>
    );
  }

  // text / heading1 / heading2 / bullet
  const isH1 = block.type === "heading1";
  const isH2 = block.type === "heading2";
  const isBullet = block.type === "bullet";

  return (
    <div className="flex items-start gap-2 group relative">
      {isBullet && (
        <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "#C9933A" }} />
      )}
      <div
        ref={(node) => inputRef(node)}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onContentChange(block.id, (e.currentTarget as HTMLDivElement).innerText)}
        onKeyDown={(e) => onKeyDown(e, block.id)}
        onPaste={handlePaste}
        onFocus={() => onFocus(block.id)}
        className="flex-1 outline-none leading-relaxed min-h-[1.5em]"
        style={{
          fontSize: isH1 ? "1.75rem" : isH2 ? "1.3rem" : "0.9rem",
          fontWeight: isH1 || isH2 ? 700 : 400,
          fontFamily: isH1 || isH2 ? "var(--font-display)" : "var(--font-body)",
          color: isH1 ? "var(--color-chalk)" : isH2 ? "var(--color-chalk)" : "var(--color-text-primary)",
          letterSpacing: isH1 ? "-0.02em" : isH2 ? "-0.01em" : "normal",
        }}
        data-placeholder={
          isH1 ? "Heading 1" : isH2 ? "Heading 2" : isBullet ? "List item…" : "Write something, or type / for commands…"
        }
      />
      {showMenu && (
        <div className="absolute left-0 top-full">
          <SlashMenu key={slashQuery} query={slashQuery.slice(1)} onSelect={(t) => onMenuSelect(block.id, t)} onClose={onMenuClose} />
        </div>
      )}
    </div>
  );
}

// ── SlashMenu ────────────────────────────────────────────────────────────────
function SlashMenu({
  query,
  onSelect,
  onClose,
}: {
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const filtered = SLASH_COMMANDS.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (filtered.length === 0) return;

    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % filtered.length); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => (a - 1 + filtered.length) % filtered.length); }
      if (e.key === "Enter")     { e.preventDefault(); if (filtered[active]) onSelect(filtered[active].type); }
      if (e.key === "Escape")    { onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, filtered, onSelect, onClose]);

  if (!filtered.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.97 }}
      transition={{ duration: 0.12 }}
      className="absolute z-50 left-0 mt-1 w-64 rounded-lg overflow-hidden shadow-2xl"
      style={{ background: "#16161E", border: "1px solid rgba(201,147,58,0.25)" }}
    >
      <p className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] uppercase text-[var(--color-text-secondary)] px-3 pt-2.5 pb-1 opacity-60">
        Block type
      </p>
      {filtered.map((cmd, i) => (
        <button
          key={cmd.type}
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd.type); }}
          className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-100"
          style={{
            background: i === active ? "rgba(201,147,58,0.12)" : "transparent",
            borderLeft: i === active ? "2px solid #C9933A" : "2px solid transparent",
          }}
        >
          <span className="font-[var(--font-mono)] text-[11px] w-6 text-center text-[var(--color-gold)] shrink-0">
            {cmd.icon}
          </span>
          <span>
            <span className="block font-[var(--font-body)] text-[13px] text-[var(--color-text-primary)]">{cmd.label}</span>
            <span className="block font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">{cmd.description}</span>
          </span>
        </button>
      ))}
    </motion.div>
  );
}

// ── Main DugoutEditor ────────────────────────────────────────────────────────
export default function DugoutEditor({
  initialPages,
  initialActivePageId,
}: {
  initialPages: DugoutPage[];
  initialActivePageId: string;
}) {
  const seededPages = initialPages.length > 0 ? initialPages : [newClientPage()];

  const [pages, setPages] = useState<DugoutPage[]>(seededPages);
  const [activePageId, setActivePageId] = useState<string>(
    seededPages.some((page) => page.id === initialActivePageId)
      ? initialActivePageId
      : seededPages[0].id
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  // slashQuery: null = no menu, "/" = just slash, "/tex" = filtering
  const [slashQuery, setSlashQuery] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isDeletingPageId, setIsDeletingPageId] = useState<string | null>(null);
  const [pendingDeletePageId, setPendingDeletePageId] = useState<string | null>(null);
  const [pickerTargetBlockId, setPickerTargetBlockId] = useState<string | null>(null);

  const inputRefs = useRef<Record<string, HTMLElement | null>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];
  const blocks = useMemo(() => activePage?.blocks ?? [], [activePage]);

  const persistActivePage = useCallback(async (pageId: string) => {
    try {
      await fetch("/api/dugout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activePageId: pageId }),
      });
    } catch {
      // Non-blocking: UI still works if this request fails.
    }
  }, []);

  // ── Auto-save (debounced 800ms) ────────────────────────────────────────────
  const scheduleSave = useCallback((pageId: string, title: string, latestBlocks: Block[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/dugout", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId, title, blocks: latestBlocks }),
        });

        if (!res.ok) throw new Error("Failed to save page");
        const data = (await res.json()) as { page?: DugoutPage };

        if (data.page) {
          setPages((prev) => prev.map((page) => (page.id === data.page?.id ? data.page : page)));
        }

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("idle");
      }
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // ── Focus a block after render ─────────────────────────────────────────────
  const focusBlock = useCallback((id: string, atEnd = true) => {
    requestAnimationFrame(() => {
      const el = inputRefs.current[id];
      if (!el) return;
      el.focus();
      if (atEnd) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  }, []);

  const focusLastEditableBlock = useCallback(() => {
    const candidate = [...blocks].reverse().find((block) => block.type !== "divider" && block.type !== "image");
    if (candidate) {
      focusBlock(candidate.id);
      return;
    }

    const fresh = newBlock("text");
    setPages((prev) => {
      const next = prev.map((page) => {
        if (page.id !== activePageId) return page;
        const updated = {
          ...page,
          blocks: [...page.blocks, fresh],
          updatedAt: new Date().toISOString(),
        };
        scheduleSave(updated.id, updated.title, updated.blocks);
        return updated;
      });
      return next;
    });
    setTimeout(() => focusBlock(fresh.id), 40);
  }, [activePageId, blocks, focusBlock, scheduleSave]);

  // ── Sync contentEditable display when block type changes ──────────────────
  useLayoutEffect(() => {
    blocks.forEach((b) => {
      const el = inputRefs.current[b.id];
      if (!el) return;
      if (el.innerText !== b.content) el.innerText = b.content;
    });
  }, [blocks, activePageId]);

  useEffect(() => {
    inputRefs.current = {};
    setFocusedId(null);
    setSlashQuery(null);
  }, [activePageId]);

  const handleSelectPage = useCallback(
    (pageId: string) => {
      setActivePageId(pageId);
      void persistActivePage(pageId);
    },
    [persistActivePage]
  );

  const handleCreatePage = useCallback(async () => {
    if (isCreatingPage) return;

    setIsCreatingPage(true);
    try {
      const res = await fetch("/api/dugout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled page" }),
      });
      if (!res.ok) throw new Error("Could not create page");

      const data = (await res.json()) as { page?: DugoutPage };
      if (!data.page) throw new Error("Invalid response");

      setPages((prev) => [data.page as DugoutPage, ...prev.filter((page) => page.id !== data.page?.id)]);
      setActivePageId(data.page.id);
      setTimeout(() => focusBlock(data.page?.blocks?.[0]?.id ?? "", false), 60);
    } catch {
      // No-op: keep current page if creation fails.
    } finally {
      setIsCreatingPage(false);
    }
  }, [focusBlock, isCreatingPage]);

  const pendingDeletePage = useMemo(
    () => pages.find((page) => page.id === pendingDeletePageId) ?? null,
    [pages, pendingDeletePageId]
  );

  const handleDeletePage = useCallback(
    (pageId: string) => {
      if (isDeletingPageId) return;
      setPendingDeletePageId(pageId);
    },
    [isDeletingPageId]
  );

  const handleConfirmDeletePage = useCallback(
    async (pageId: string) => {
      if (isDeletingPageId) return;

      if (saveTimer.current && activePageId === pageId) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
        setSaveStatus("idle");
      }

      setIsDeletingPageId(pageId);
      try {
        const res = await fetch("/api/dugout", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId }),
        });
        if (!res.ok) throw new Error("Could not delete page");

        const data = (await res.json()) as {
          pages?: DugoutPage[];
          activePageId?: string;
        };

        if (!Array.isArray(data.pages) || typeof data.activePageId !== "string") {
          throw new Error("Invalid response");
        }

        setPages(data.pages);
        setActivePageId(data.activePageId);
        setPendingDeletePageId(null);
      } catch {
        // No-op: keep current state if deletion fails.
      } finally {
        setIsDeletingPageId(null);
      }
    },
    [activePageId, isDeletingPageId]
  );

  const updateActivePage = useCallback(
    (updater: (page: DugoutPage) => DugoutPage) => {
      setPages((prev) => prev.map((page) => (page.id === activePageId ? updater(page) : page)));
    },
    [activePageId]
  );

  const handleTitleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateActivePage((page) => {
        const updated = {
          ...page,
          title: value,
          updatedAt: new Date().toISOString(),
        };
        scheduleSave(updated.id, updated.title, updated.blocks);
        return updated;
      });
    },
    [scheduleSave, updateActivePage]
  );

  // ── Content change ─────────────────────────────────────────────────────────
  const handleContentChange = useCallback((id: string, val: string) => {
    // Detect slash command
    if (val.startsWith("/")) {
      setSlashQuery(val);
    } else {
      setSlashQuery(null);
    }
    updateActivePage((page) => {
      const nextBlocks: Block[] = page.blocks.map((b) =>
        b.id === id ? ({ ...b, content: val } as Block) : b
      );
      const nextTitle = isUntitledTitle(page.title)
        ? deriveTitleFromBlocks(nextBlocks)
        : page.title;
      const updated = {
        ...page,
        title: nextTitle,
        blocks: nextBlocks,
        updatedAt: new Date().toISOString(),
      };
      scheduleSave(updated.id, updated.title, updated.blocks);
      return updated;
    });
  }, [scheduleSave, updateActivePage]);

  const requestImageAttach = useCallback((blockId: string) => {
    setPickerTargetBlockId(blockId);
    imageInputRef.current?.click();
  }, []);

  const applyImageToBlock = useCallback(
    (blockId: string, dataUrl: string) => {
      updateActivePage((page) => {
        const nextBlocks: Block[] = page.blocks.map((block) =>
          block.id === blockId
            ? ({ ...block, type: "image", content: dataUrl } as Block)
            : block
        );
        const updated = {
          ...page,
          blocks: nextBlocks,
          updatedAt: new Date().toISOString(),
        };
        scheduleSave(updated.id, updated.title, updated.blocks);
        return updated;
      });
    },
    [scheduleSave, updateActivePage]
  );

  const insertImageAfterBlock = useCallback(
    async (blockId: string, file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_IMAGE_BYTES) return;

      const dataUrl = await fileToDataUrl(file);
      const imageBlock: Block = {
        id: crypto.randomUUID(),
        type: "image",
        content: dataUrl,
      };

      updateActivePage((page) => {
        const idx = page.blocks.findIndex((block) => block.id === blockId);
        const nextBlocks = [...page.blocks];
        if (idx === -1) {
          nextBlocks.push(imageBlock);
        } else {
          nextBlocks.splice(idx + 1, 0, imageBlock);
        }

        const updated = {
          ...page,
          blocks: nextBlocks,
          updatedAt: new Date().toISOString(),
        };
        scheduleSave(updated.id, updated.title, updated.blocks);
        return updated;
      });
    },
    [scheduleSave, updateActivePage]
  );

  const handleImageInput = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const target = pickerTargetBlockId;
      e.target.value = "";
      setPickerTargetBlockId(null);

      if (!file || !target) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_IMAGE_BYTES) return;

      try {
        const dataUrl = await fileToDataUrl(file);
        applyImageToBlock(target, dataUrl);
      } catch {
        // Ignore file read failures.
      }
    },
    [applyImageToBlock, pickerTargetBlockId]
  );

  const handleAddImageBlock = useCallback(() => {
    const imageBlock: Block = { id: crypto.randomUUID(), type: "image", content: "" };
    updateActivePage((page) => {
      const updated = {
        ...page,
        blocks: [...page.blocks, imageBlock],
        updatedAt: new Date().toISOString(),
      };
      scheduleSave(updated.id, updated.title, updated.blocks);
      return updated;
    });

    requestImageAttach(imageBlock.id);
  }, [requestImageAttach, scheduleSave, updateActivePage]);

  // ── Slash menu select ──────────────────────────────────────────────────────
  const handleMenuSelect = useCallback((id: string, type: BlockType) => {
    setSlashQuery(null);
    let nextFocusId: string | null = null;
    let openImagePickerForId: string | null = null;

    updateActivePage((page) => {
      const nextBlocks = [...page.blocks];
      const idx = nextBlocks.findIndex((block) => block.id === id);
      if (idx === -1) return page;

      nextBlocks[idx] = {
        ...nextBlocks[idx],
        type,
        content: "",
        checked: false,
      };

      if (type === "divider") {
        const fresh = newBlock("text");
        nextBlocks.splice(idx + 1, 0, fresh);
        nextFocusId = fresh.id;
      }

      if (type === "image") {
        openImagePickerForId = id;
      }

      const updated = {
        ...page,
        blocks: nextBlocks,
        updatedAt: new Date().toISOString(),
      };
      scheduleSave(updated.id, updated.title, updated.blocks);
      return updated;
    });

    if (openImagePickerForId) {
      requestImageAttach(openImagePickerForId);
      return;
    }

    if (nextFocusId) {
      setTimeout(() => focusBlock(nextFocusId!), 60);
      return;
    }

    // Clear the contentEditable
    requestAnimationFrame(() => {
      const el = inputRefs.current[id];
      if (el) { el.innerText = ""; focusBlock(id); }
    });
  }, [focusBlock, requestImageAttach, scheduleSave, updateActivePage]);

  const handleMenuClose = useCallback(() => setSlashQuery(null), []);

  // ── Checklist toggle ───────────────────────────────────────────────────────
  const handleCheckToggle = useCallback((id: string) => {
    updateActivePage((page) => {
      const nextBlocks: Block[] = page.blocks.map((b) =>
        b.id === id ? ({ ...b, checked: !b.checked } as Block) : b
      );
      const updated = {
        ...page,
        blocks: nextBlocks,
        updatedAt: new Date().toISOString(),
      };
      scheduleSave(updated.id, updated.title, updated.blocks);
      return updated;
    });
  }, [scheduleSave, updateActivePage]);

  const handleRemoveBlock = useCallback((id: string) => {
    if (blocks.length <= 1) return;

    const idx = blocks.findIndex((block) => block.id === id);
    const nextFocus = blocks[idx - 1] ?? blocks[idx + 1];

    updateActivePage((page) => {
      const nextBlocks = page.blocks.filter((block) => block.id !== id);
      const updated = {
        ...page,
        blocks: nextBlocks.length > 0 ? nextBlocks : [newBlock("text")],
        updatedAt: new Date().toISOString(),
      };
      scheduleSave(updated.id, updated.title, updated.blocks);
      return updated;
    });

    if (nextFocus && nextFocus.type !== "image" && nextFocus.type !== "divider") {
      setTimeout(() => focusBlock(nextFocus.id), 40);
    }
  }, [blocks, focusBlock, scheduleSave, updateActivePage]);

  // ── Keyboard handling ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, id: string) => {
      const idx = blocks.findIndex((b) => b.id === id);
      const block = blocks[idx];
      const isEmpty = (block?.content ?? "").trim() === "" && block?.type !== "divider";

      // Enter → new block below (unless in code block use shift+enter)
      if (e.key === "Enter" && !e.shiftKey) {
        if (block?.type === "code") return; // allow native newlines in code
        e.preventDefault();
        if (slashQuery !== null) return; // menu is handling it

        const continuationType: BlockType =
          block?.type === "bullet" || block?.type === "checklist" ? block.type : "text";
        const fresh = newBlock(continuationType);

        updateActivePage((page) => {
          const nextBlocks = [...page.blocks];
          nextBlocks.splice(idx + 1, 0, fresh);
          const updated = {
            ...page,
            blocks: nextBlocks,
            updatedAt: new Date().toISOString(),
          };
          scheduleSave(updated.id, updated.title, updated.blocks);
          return updated;
        });
        setTimeout(() => focusBlock(fresh.id, false), 30);
      }

      // Backspace on empty block → remove it
      if (e.key === "Backspace" && isEmpty && blocks.length > 1) {
        e.preventDefault();
        updateActivePage((page) => {
          const nextBlocks = page.blocks.filter((b) => b.id !== id);
          const updated = {
            ...page,
            blocks: nextBlocks,
            updatedAt: new Date().toISOString(),
          };
          scheduleSave(updated.id, updated.title, updated.blocks);
          return updated;
        });
        const prevBlock = blocks[idx - 1] ?? blocks[idx + 1];
        if (prevBlock && prevBlock.type !== "image" && prevBlock.type !== "divider") {
          setTimeout(() => focusBlock(prevBlock.id), 30);
        }
      }

      // Arrow up/down to move between blocks
      if (e.key === "ArrowUp" && idx > 0 && slashQuery === null) {
        const el = inputRefs.current[id];
        const sel = window.getSelection();
        // only jump if cursor is at position 0
        if (sel?.anchorOffset === 0 && (!el || el.innerText.indexOf("\n") === -1)) {
          e.preventDefault();
          focusBlock(blocks[idx - 1].id);
        }
      }
      if (e.key === "ArrowDown" && idx < blocks.length - 1 && slashQuery === null) {
        const el = inputRefs.current[id];
        const sel = window.getSelection();
        const text = el?.innerText ?? "";
        if (sel?.anchorOffset === text.length) {
          e.preventDefault();
          focusBlock(blocks[idx + 1].id, false);
        }
      }
    },
    [blocks, slashQuery, scheduleSave, focusBlock, updateActivePage]
  );

  if (!activePage) return null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 lg:gap-6">
      {/* Pages sidebar */}
      <aside
        className="rounded-lg p-3 lg:p-4"
        style={{
          background: "rgba(8,8,8,0.52)",
          border: "1px solid rgba(201,147,58,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-[var(--font-mono)] text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-secondary)]">
            Saved notes
          </p>
          <button
            onClick={() => void handleCreatePage()}
            disabled={isCreatingPage}
            className="text-[11px] px-2 py-1 rounded font-[var(--font-mono)] tracking-[0.14em] uppercase transition-opacity disabled:opacity-50"
            style={{
              color: "#0A0A0A",
              background: "#C9933A",
            }}
          >
            + New
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-1.5">
            {pages.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <div
                  key={page.id}
                  className="group px-3 py-2 rounded-md transition-colors"
                  style={{
                    background: isActive ? "rgba(201,147,58,0.16)" : "transparent",
                    border: isActive ? "1px solid rgba(201,147,58,0.35)" : "1px solid transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => handleSelectPage(page.id)}
                      className="text-left flex-1 min-w-0"
                    >
                      <p className="font-[var(--font-body)] text-[13px] text-[var(--color-text-primary)] truncate">
                        {page.title || "Untitled page"}
                      </p>
                      <p className="font-[var(--font-mono)] text-[9px] tracking-[0.12em] uppercase text-[var(--color-text-secondary)] mt-1 opacity-80">
                        {formatCreatedAt(page.createdAt)}
                      </p>
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      disabled={isDeletingPageId === page.id}
                      className="shrink-0 w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-30"
                      style={{
                        color: "#F0EDE6",
                        background: "rgba(178,34,34,0.18)",
                        border: "1px solid rgba(178,34,34,0.42)",
                      }}
                      aria-label={`Delete ${page.title || "Untitled page"}`}
                      title="Delete page"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                        <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main page */}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 mb-3">
          <input
            value={activePage.title}
            onChange={handleTitleChange}
            placeholder="Untitled page"
            className="bg-transparent border-none outline-none font-[var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-chalk)] w-full"
          />
          <button
            onClick={handleAddImageBlock}
            className="shrink-0 text-[10px] px-3 py-2 rounded-md font-[var(--font-mono)] tracking-[0.16em] uppercase"
            style={{
              color: "#F0EDE6",
              border: "1px solid rgba(201,147,58,0.35)",
              background: "rgba(14,14,14,0.65)",
            }}
          >
            Add image
          </button>
        </div>

        {/* Save indicator */}
        <div className="flex justify-end mb-4 h-4">
          <AnimatePresence>
            {saveStatus !== "idle" && (
              <motion.span
                key={saveStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-[var(--font-mono)] text-[10px] tracking-[0.18em] uppercase"
                style={{ color: saveStatus === "saved" ? "#4A7C6F" : "var(--color-text-secondary)" }}
              >
                {saveStatus === "saving" ? "Saving…" : "✓ Saved"}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Block list */}
        <div
          className="min-h-[60vh] rounded-lg p-6 sm:p-8"
          style={{ background: "rgba(10,10,10,0.45)", border: "1px solid rgba(201,147,58,0.12)" }}
          onClick={() => focusLastEditableBlock()}
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-1">
            <AnimatePresence mode="popLayout">
              {blocks.map((block) => (
                <motion.div
                  key={block.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BlockRow
                    block={block}
                    isFocused={focusedId === block.id}
                    activeId={slashQuery !== null ? focusedId : null}
                    slashQuery={slashQuery ?? ""}
                    onContentChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onFocus={setFocusedId}
                    onCheckToggle={handleCheckToggle}
                    onRemove={handleRemoveBlock}
                    onRequestImageAttach={requestImageAttach}
                    onPasteImage={(id, file) => {
                      void insertImageAfterBlock(id, file);
                    }}
                    onMenuSelect={handleMenuSelect}
                    onMenuClose={handleMenuClose}
                    inputRef={(el) => {
                      inputRefs.current[block.id] = el;
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Click below to add */}
            <button
              className="mt-4 text-left font-[var(--font-body)] text-[13px] text-[var(--color-text-secondary)] opacity-30 hover:opacity-60 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                const fresh = newBlock("text");
                updateActivePage((page) => {
                  const updated = {
                    ...page,
                    blocks: [...page.blocks, fresh],
                    updatedAt: new Date().toISOString(),
                  };
                  scheduleSave(updated.id, updated.title, updated.blocks);
                  return updated;
                });
                setTimeout(() => focusBlock(fresh.id, false), 30);
              }}
            >
              + Click to add a block…
            </button>
          </div>
        </div>

        {/* Hint bar */}
        <p className="mt-3 text-center font-[var(--font-mono)] text-[10px] tracking-[0.15em] text-[var(--color-text-secondary)] opacity-40 uppercase">
          Type <span className="text-[var(--color-gold)] opacity-80">/</span> for block types · Paste images directly · Enter for new line
        </p>
      </div>

      <AnimatePresence>
        {pendingDeletePage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            style={{ background: "rgba(6,6,6,0.62)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="w-full max-w-md rounded-lg p-5"
              style={{
                background: "rgba(12,12,12,0.96)",
                border: "1px solid rgba(201,147,58,0.24)",
                boxShadow: "0 12px 42px rgba(0,0,0,0.42)",
              }}
            >
              <p className="font-[var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-[var(--color-gold)] opacity-90 mb-2">
                Confirm deletion
              </p>
              <h3 className="font-[var(--font-display)] text-[20px] text-[var(--color-chalk)] leading-tight mb-2">
                Delete this page?
              </h3>
              <p className="font-[var(--font-body)] text-[13px] text-[var(--color-text-secondary)] mb-5">
                &ldquo;{pendingDeletePage.title || "Untitled page"}&rdquo; will be permanently removed.
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingDeletePageId(null)}
                  disabled={isDeletingPageId === pendingDeletePage.id}
                  className="px-3 py-1.5 rounded font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase disabled:opacity-40"
                  style={{
                    color: "#E6DFD4",
                    border: "1px solid rgba(240,237,230,0.28)",
                    background: "transparent",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleConfirmDeletePage(pendingDeletePage.id)}
                  disabled={isDeletingPageId === pendingDeletePage.id}
                  className="px-3 py-1.5 rounded font-[var(--font-mono)] text-[10px] tracking-[0.14em] uppercase disabled:opacity-40"
                  style={{
                    color: "#F0EDE6",
                    border: "1px solid rgba(178,34,34,0.58)",
                    background: "rgba(178,34,34,0.28)",
                  }}
                >
                  {isDeletingPageId === pendingDeletePage.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleImageInput(e);
        }}
      />

      {/* Placeholder CSS */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(240,237,230,0.18);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
