/**
 * Simple file-based store for the Dugout note-taking pad.
 * Each user gets a workspace containing multiple pages in
 * data/dugout.json as { [username]: DugoutWorkspace }.
 *
 * NOTE: File writes don't persist on serverless platforms (e.g. Vercel).
 * Swap readStore / writeStore for a real DB adapter when deploying there.
 */

import fs from "fs";
import path from "path";

// ── Types ────────────────────────────────────────────────────────────────────

export type BlockType =
  | "text"
  | "heading1"
  | "heading2"
  | "bullet"
  | "checklist"
  | "divider"
  | "code"
  | "image";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // only for checklist blocks
}

export interface DugoutPage {
  id: string;
  title: string;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

export interface DugoutWorkspace {
  pages: DugoutPage[];
  activePageId: string;
}

type Store = Record<string, DugoutWorkspace>;
const UNTITLED_TITLE = "Untitled page";

// ── Persistence ──────────────────────────────────────────────────────────────

const STORE_PATH = path.join(process.cwd(), "data", "dugout.json");

function readStore(): Store {
  try {
    if (!fs.existsSync(STORE_PATH)) return {};
    const raw = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as unknown;
    return normaliseStore(raw);
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

// ── Normalisation / migration helpers ───────────────────────────────────────

function nowIso(): string {
  return new Date().toISOString();
}

function makeDefaultBlock(): Block {
  return { id: crypto.randomUUID(), type: "text", content: "" };
}

function makeBlankPage(title = "Untitled page"): DugoutPage {
  const now = nowIso();
  return {
    id: crypto.randomUUID(),
    title,
    blocks: [makeDefaultBlock()],
    createdAt: now,
    updatedAt: now,
  };
}

function isUntitledTitle(title: string): boolean {
  return title.trim().toLowerCase() === UNTITLED_TITLE.toLowerCase();
}

function sortPagesByCreatedAtDesc(pages: DugoutPage[]): DugoutPage[] {
  return [...pages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function isBlockType(value: unknown): value is BlockType {
  return (
    value === "text" ||
    value === "heading1" ||
    value === "heading2" ||
    value === "bullet" ||
    value === "checklist" ||
    value === "divider" ||
    value === "code" ||
    value === "image"
  );
}

function normaliseBlocks(rawBlocks: unknown): Block[] {
  if (!Array.isArray(rawBlocks)) return [makeDefaultBlock()];

  const blocks = rawBlocks.map((raw) => {
    const item = raw as Partial<Block>;
    const type = isBlockType(item.type) ? item.type : "text";
    const content = typeof item.content === "string" ? item.content : "";
    const checked = type === "checklist" ? Boolean(item.checked) : undefined;

    return {
      id: typeof item.id === "string" ? item.id : crypto.randomUUID(),
      type,
      content,
      checked,
    } satisfies Block;
  });

  return blocks.length > 0 ? blocks : [makeDefaultBlock()];
}

function deriveTitle(blocks: Block[]): string {
  const heading = blocks.find((block) =>
    (block.type === "heading1" || block.type === "heading2") && block.content.trim().length > 0
  );
  if (heading) return heading.content.trim().slice(0, 80);

  const firstText = blocks.find((block) => block.content.trim().length > 0);
  if (firstText) return firstText.content.trim().slice(0, 80);

  return "Untitled page";
}

function normalisePage(rawPage: unknown): DugoutPage {
  const raw = rawPage as Partial<DugoutPage>;
  const blocks = normaliseBlocks(raw.blocks);
  const now = nowIso();
  const rawTitle = typeof raw.title === "string" ? raw.title.trim() : "";
  const derived = deriveTitle(blocks);

  return {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    title:
      rawTitle.length > 0 && !isUntitledTitle(rawTitle)
        ? rawTitle.slice(0, 120)
        : derived,
    blocks,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : now,
  };
}

function normaliseWorkspace(rawWorkspace: unknown): DugoutWorkspace {
  const raw = rawWorkspace as {
    pages?: unknown;
    activePageId?: unknown;
    blocks?: unknown;
    updatedAt?: unknown;
  };

  // Legacy shape: { blocks, updatedAt }
  if (Array.isArray(raw.blocks)) {
    const blocks = normaliseBlocks(raw.blocks);
    const page = normalisePage({
      id: crypto.randomUUID(),
      title: deriveTitle(blocks),
      blocks,
      createdAt: typeof raw.updatedAt === "string" ? raw.updatedAt : nowIso(),
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : nowIso(),
    });
    return { pages: [page], activePageId: page.id };
  }

  const pages = Array.isArray(raw.pages)
    ? sortPagesByCreatedAtDesc(raw.pages.map((page) => normalisePage(page)))
    : [];

  if (pages.length === 0) {
    const page = makeBlankPage();
    return { pages: [page], activePageId: page.id };
  }

  const activeCandidate = typeof raw.activePageId === "string" ? raw.activePageId : "";
  const activePageId = pages.some((page) => page.id === activeCandidate) ? activeCandidate : pages[0].id;

  return { pages, activePageId };
}

function normaliseStore(rawStore: unknown): Store {
  if (!rawStore || typeof rawStore !== "object") return {};

  const entries = Object.entries(rawStore as Record<string, unknown>).map(([username, rawWorkspace]) => [
    username,
    normaliseWorkspace(rawWorkspace),
  ] as const);

  return Object.fromEntries(entries);
}

function getWorkspaceFromStore(store: Store, username: string): DugoutWorkspace {
  return store[username] ?? normaliseWorkspace({});
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Return the full Dugout workspace for a user. */
export function getWorkspaceForUser(username: string): DugoutWorkspace {
  const store = readStore();
  return getWorkspaceFromStore(store, username);
}

/** Create and persist a new page for a user, and set it active. */
export function createPageForUser(username: string, title = "Untitled page"): DugoutPage {
  const store = readStore();
  const workspace = getWorkspaceFromStore(store, username);

  const page = makeBlankPage(title.trim().length > 0 ? title.trim().slice(0, 120) : "Untitled page");
  workspace.pages = [page, ...workspace.pages];
  workspace.activePageId = page.id;

  store[username] = workspace;
  writeStore(store);
  return page;
}

/** Update active page selection. */
export function setActivePageForUser(username: string, pageId: string): DugoutWorkspace {
  const store = readStore();
  const workspace = getWorkspaceFromStore(store, username);
  const exists = workspace.pages.some((page) => page.id === pageId);
  if (!exists) return workspace;

  workspace.activePageId = pageId;

  store[username] = workspace;
  writeStore(store);
  return workspace;
}

/** Overwrite one page for a user. */
export function savePageForUser(
  username: string,
  pageId: string,
  blocks: Block[],
  title?: string
): DugoutPage {
  const store = readStore();
  const workspace = getWorkspaceFromStore(store, username);
  const now = nowIso();
  const normalisedBlocks = normaliseBlocks(blocks);
  const titleFromPayload = typeof title === "string" ? title.trim() : "";

  const idx = workspace.pages.findIndex((page) => page.id === pageId);
  if (idx === -1) {
    const derived = deriveTitle(normalisedBlocks);
    const created: DugoutPage = {
      id: pageId,
      title:
        titleFromPayload.length > 0 && !isUntitledTitle(titleFromPayload)
          ? titleFromPayload.slice(0, 120)
          : derived,
      blocks: normalisedBlocks,
      createdAt: now,
      updatedAt: now,
    };
    workspace.pages = sortPagesByCreatedAtDesc([created, ...workspace.pages]);
    workspace.activePageId = created.id;
    store[username] = workspace;
    writeStore(store);
    return created;
  }

  const existing = workspace.pages[idx];
  const derived = deriveTitle(normalisedBlocks);
  const updated: DugoutPage = {
    ...existing,
    title:
      titleFromPayload.length > 0 && !isUntitledTitle(titleFromPayload)
        ? titleFromPayload.slice(0, 120)
        : isUntitledTitle(existing.title)
          ? derived
          : existing.title,
    blocks: normalisedBlocks,
    updatedAt: now,
  };

  workspace.pages[idx] = updated;
  workspace.activePageId = updated.id;
  workspace.pages = sortPagesByCreatedAtDesc(workspace.pages);

  store[username] = workspace;
  writeStore(store);
  return updated;
}

/** Delete one page for a user and keep a valid active page selected. */
export function deletePageForUser(username: string, pageId: string): DugoutWorkspace | null {
  const store = readStore();
  const workspace = getWorkspaceFromStore(store, username);
  const idx = workspace.pages.findIndex((page) => page.id === pageId);

  if (idx === -1) return null;

  const remainingPages = workspace.pages.filter((page) => page.id !== pageId);
  if (remainingPages.length === 0) {
    const page = makeBlankPage();
    workspace.pages = [page];
    workspace.activePageId = page.id;
  } else {
    workspace.pages = remainingPages;
    if (workspace.activePageId === pageId) {
      workspace.activePageId = remainingPages[0].id;
    }
  }

  store[username] = workspace;
  writeStore(store);
  return workspace;
}

