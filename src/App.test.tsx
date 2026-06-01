import { describe, expect, it } from 'vitest';
import App from './App';
import { renderWithProviders, screen } from './test/utils';

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderWithProviders(<App />, { route: '/' });
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders the about page at /about', () => {
    renderWithProviders(<App />, { route: '/about' });
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('renders the 404 page for unknown routes', () => {
    renderWithProviders(<App />, { route: '/does-not-exist' });
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
  });
});
