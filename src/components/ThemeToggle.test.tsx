import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { renderWithProviders, screen } from '../test/utils';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('flips the dark class on the document element when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const before = document.documentElement.classList.contains('dark');

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(!before);

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(before);
  });
});
