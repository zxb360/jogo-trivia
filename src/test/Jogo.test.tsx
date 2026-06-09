import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import Jogo from '../pages/Jogo';
import LoginContext from '../context/LoginContext';

vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

describe('Página de Jogo', () => {
  const contextValue = {
    isLoggedIn: true,
    login: vi.fn(),
    logout: vi.fn(),
    token: 'mock-token',
    tokenLogin: vi.fn(),
  };

  it('deve exibir "Carregando..." e depois mostrar a primeira pergunta', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [{
          category: 'Science',
          difficulty: 'easy',
          question: 'Is the earth round?',
          correct_answer: 'Yes',
          incorrect_answers: ['No'],
        }],
      },
    });

    render(
      <LoginContext.Provider value={contextValue}>
        <BrowserRouter>
          <Jogo />
        </BrowserRouter>
      </LoginContext.Provider>
    );

    expect(screen.getByText(/Carregando perguntas.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Is the earth round\?/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Science/i)).toBeInTheDocument();
  });
});