import { useState, useCallback, useEffect } from "react";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiHook<T> extends ApiState<T> {
  fetchData: () => Promise<void>;
  mutate: (newData: T) => void;
}

export function useApi<T>(url: string, initialFetch = true): ApiHook<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      const result = await response.json();
      setState({ data: result.data, isLoading: false, error: null });
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [url]);

  const mutate = useCallback((newData: T) => {
    setState((prev) => ({ ...prev, data: newData }));
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [fetchData, initialFetch]);

  return { ...state, fetchData, mutate };
}

export default useApi;
