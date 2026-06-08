import { createContext } from 'react';

type LoginContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  token: string | null;
  tokenLogin: () => void;
};

const LoginContext = createContext({} as LoginContextType);

export default LoginContext;