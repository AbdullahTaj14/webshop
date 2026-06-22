import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  recentQueries: string[];
  addQuery: (query: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentQueries: [],
      addQuery: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const next = [trimmed, ...get().recentQueries.filter((q) => q !== trimmed)].slice(0, 5);
        set({ recentQueries: next });
      },
      clear: () => set({ recentQueries: [] }),
    }),
    { name: "aro-recent-searches", skipHydration: true }
  )
);
