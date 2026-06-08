import { useState } from 'react';
import LoginContext from './LoginContext';

type LoginProviderProps = {
  children: React.ReactNode;
};

export default function LoginProvider({ children }: LoginProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  function tokenLogin(email: string) {
    const savedTokens = JSON.parse(localStorage.getItem('trivia_tokens_map') || '{}');
    const existingData = savedTokens[email];
    const SIX_HOURS = 6 * 60 * 60 * 1000;

    // Verifica se o token existe para este e-mail e se ainda é válido (menos de 6 horas)
    if (existingData && (Date.now() - existingData.timestamp < SIX_HOURS)) {
      localStorage.setItem('token', existingData.token);
      setToken(existingData.token);
      setIsLoggedIn(true);
      return;
    }

    // Se não existir ou estiver expirado, busca um novo
    fetch('https://opentdb.com/api_token.php?command=request')
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          const newToken = data.token;
          const newTokenData = { token: newToken, timestamp: Date.now() };
          
          // Atualiza o mapa de tokens por usuário e o token atual
          localStorage.setItem('trivia_tokens_map', JSON.stringify({ ...savedTokens, [email]: newTokenData }));
          localStorage.setItem('token', newToken);
          setToken(newToken);
          setIsLoggedIn(true);
        }
      });
  }

  function login() {
    setIsLoggedIn(true);
    }

  function logout() {
    setIsLoggedIn(false);
    setToken(null);
    // Aqui você pode adicionar lógica adicional para limpar tokens, etc.
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout, token, tokenLogin }}>
      {children}
    </LoginContext.Provider>
  );
}
