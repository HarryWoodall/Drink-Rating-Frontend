import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { renderWithProviders, screen } from '../test/utils';

describe('ThemeToggle', () => {
  it('toggles the dark class on the document element', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
