import { create } from "zustand";

interface RouteHistoryState {
  currentPath: string | null;
  currentQuery: string | null;
  previousPath: string | null;
  previousQuery: string | null;
  currentBackText: string | null;
  previousBackText: string | null;
  setPath: (path: string, backText: string, query?: string) => void;
  resetPath: (path: string, backText: string, query?: string) => void;
  fullPreviousPath: () => string;
}

export const useRouteHistoryStore = create<RouteHistoryState>((set, get) => ({
  currentPath: null,
  currentQuery: null,
  previousPath: null,
  previousQuery: null,
  currentBackText: null,
  previousBackText: null,
  setPath: (path, backText, query) => {
    const { currentPath, currentQuery, currentBackText } = get();

    if (path === currentPath) {
      if (query === currentQuery) {
        return;
      }

      set({
        currentPath: path,
        currentQuery: query,
        currentBackText: backText,
      });

      return;
    }

    set({
      previousPath: currentPath,
      previousQuery: currentQuery,
      currentPath: path,
      currentQuery: query,
      previousBackText: currentBackText,
      currentBackText: backText,
    });
  },
  resetPath: (path, backText, query) => {
    set({
      previousPath: null,
      previousQuery: null,
      currentPath: path,
      currentQuery: query,
      previousBackText: null,
      currentBackText: backText,
    });
  },
  fullPreviousPath: () => {
    const { previousPath, previousQuery } = get();

    if (!previousPath) {
      return "";
    }

    return previousPath + (previousQuery ?? "");
  },
}));
