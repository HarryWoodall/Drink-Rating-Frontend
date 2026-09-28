import { render, renderHook, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../theme/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

// Fresh client per render; no retries so failed fetches settle immediately.
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

/**
 * Renders a hook inside a QueryClientProvider and MemoryRouter. Pass your own
 * `queryClient` to seed or inspect the cache.
 */
export function renderHookWithProviders<Result, Props>(
  hook: (props: Props) => Result,
  {
    queryClient = createTestQueryClient(),
    route = '/',
    initialProps,
  }: { queryClient?: QueryClient; route?: string; initialProps?: Props } = {},
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return { ...renderHook(hook, { wrapper, initialProps }), queryClient };
}

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/', ...options }: Options = {},
) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>,
    options,
  );
}

export * from '@testing-library/react';
