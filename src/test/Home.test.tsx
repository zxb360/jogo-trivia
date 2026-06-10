import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import Home from '../pages/Home';
import LoginContext from '../context/LoginContext';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockedUsedNavigate };
});

const contextValue = {
  isLoggedIn: false,
  login: vi.fn(),
  logout: vi.fn(),
  token: null,
  tokenLogin: vi.fn(),
};

function renderHome(children: ReactNode = <Home />) {
  return render(
    <LoginContext.Provider value={contextValue}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </LoginContext.Provider>
  );
}

describe('Página Home', () => {
  it('deve renderizar o título e o botão Play', () => {
    renderHome();
    expect(screen.getByAltText(/Logo do Jogo Trivia/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play/i })).toBeInTheDocument();
  });

  it('deve chamar login ao clicar em Play', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('button', { name: /Play/i }));
    expect(contextValue.login).toHaveBeenCalled();
  });
});
