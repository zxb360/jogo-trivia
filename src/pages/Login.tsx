import { useContext } from 'react';
import LoginContext from '../context/LoginContext';
import { useNavigate } from "react-router-dom";



export default function Login() {
  const loginContext = useContext(LoginContext);
  const navegate = useNavigate();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    loginContext.tokenLogin();
    navegate('/jogo');
  };

  return (
    <>
        <h1>Login</h1>
        <form>
          <input type="email" placeholder="Email" />
          <button onClick={handleLogin} type="submit">Login</button>
        </form>
    </>
  )
}
