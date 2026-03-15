/**
 * useApi Hook
 * Provides simplified API access with loading and error states
 * Useful for components that need to display loading spinners or error messages
 */

import { useState, useCallback } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Generic API hook for fetching data
 * @example
 * const { data: homes, loading, error, refetch } = useApi(
 *   () => homeService.getHomes()
 * );
 */
export function useApi<T>(apiCall: () => Promise<T>, immediate = true) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [apiCall]);

  // Execute immediately if requested
  const [initialized, setInitialized] = useState(!immediate);
  if (!initialized && immediate) {
    execute();
    setInitialized(true);
  }

  return {
    ...state,
    refetch: execute,
    isLoading: state.loading,
    isError: state.error !== null,
  };
}

/**
 * Hook for API mutations with optimistic updates
 * @example
 * const { execute, loading } = useApiMutation(
 *   (name: string) => homeService.createHome(name)
 * );
 */
export function useApiMutation<Args extends any[], R>(
  mutationFn: (...args: Args) => Promise<R>
) {
  const [state, setState] = useState<UseApiState<R>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await mutationFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error });
        throw error;
      }
    },
    [mutationFn]
  );

  return {
    ...state,
    execute,
    isLoading: state.loading,
    isError: state.error !== null,
  };
}
