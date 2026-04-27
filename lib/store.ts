"use client";

import { create } from "zustand";
import { BagsEvent } from "./types";

interface Toast {
  id: string;
  message: string;
  type: "bags" | "success" | "error";
}

interface AppState {
  // Toasts / notifications
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;

  // Bags event stream
  lastBagsEvent: BagsEvent | null;
  emitBagsEvent: (event: BagsEvent) => void;

  // Optimistic votes
  votedMemes: Set<string>;
  voteOnMeme: (memeId: string) => void;

  // Creator project state (per session)
  myBagsProjectId: string | null;
  myTokenSymbol: string | null;
  setMyBagsProject: (projectId: string, tokenSymbol: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  lastBagsEvent: null,
  emitBagsEvent: (event) => {
    set({ lastBagsEvent: event });
  },

  votedMemes: new Set(),
  voteOnMeme: (memeId) =>
    set((s) => {
      const next = new Set(s.votedMemes);
      next.add(memeId);
      return { votedMemes: next };
    }),

  myBagsProjectId: null,
  myTokenSymbol: null,
  setMyBagsProject: (projectId, tokenSymbol) =>
    set({ myBagsProjectId: projectId, myTokenSymbol: tokenSymbol }),
}));
