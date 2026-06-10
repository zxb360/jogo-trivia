import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/Home';
import LoginContext from '../context/LoginContext';

describe('Página de Login', () => {
  const tokenLogin = vi.fn();
  const contextValue = {
    isLoggedIn: true,
    login: vi.fn(),
    logout: vi.fn(),
    token: null,
    tokenLogin,
  };

  it('deve permitir digitar o e-mail e clicar no botão', async () => {
    render(
      <LoginContext.Provider value={contextValue}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </LoginContext.Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Email/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await userEvent.type(emailInput, 'dev@test.com');
    expect(emailInput).toHaveValue('dev@test.com');

    await userEvent.click(loginButton);
    expect(tokenLogin).toHaveBeenCalledWith('dev@test.com');
  });
});
