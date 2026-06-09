import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/Home';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return { ...actual, useNavigate: () => mockedUsedNavigate };
});

describe('Página Home', () => {
  it('deve renderizar o título e o botão Play', () => {
    render(<BrowserRouter><Home /></BrowserRouter>);
    expect(screen.getByText(/Jogo Trivia/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument();
  });

  it('deve navegar para a rota /login ao clicar em Play', async () => {
    render(<BrowserRouter><Home /></BrowserRouter>);
    await userEvent.click(screen.getByRole('button', { name: /Play/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });
});