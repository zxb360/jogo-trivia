import { useState } from 'react';
import LoginContext from './LoginContext';

type LoginProviderProps = {
  children: React.ReactNode;
};

export default function LoginProvider({ children }: LoginProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  function tokenLogin() {
    fetch('https://opentdb.com/api_token.php?command=request')
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          const token = data.token;
          localStorage.setItem('token', token);
          setToken(token);
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
