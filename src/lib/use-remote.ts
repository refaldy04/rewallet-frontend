"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./client";
export function useRemote<T>(path: string | null) {
  const [state, setState] = useState<{
    data: T | null;
    error: string;
    loading: boolean;
  }>({ data: null, error: "", loading: true });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      if (!path) return;
      setState({ data: null, error: "", loading: true });
      try {
        const data = await api<T>(path);
        if (active) setState({ data, error: "", loading: false });
      } catch (e) {
        if (active)
          setState({ data: null, error: (e as Error).message, loading: false });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [path, revision]);
  const retry = useCallback(() => setRevision((n) => n + 1), []);
  return { ...state, retry };
}
