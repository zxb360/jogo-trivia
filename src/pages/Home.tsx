import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import LoginContext from '../context/LoginContext';
import logo_trivia from '../assets/jogo_trivia.png';

export default function Home() {
  // const [ativar, setAtivar] = useState(true);
  const navegate = useNavigate();
  const loginContext = useContext(LoginContext);
  const [email, setEmail] = useState('');
  // const navegate = useNavigate();

  const handlePlay = () => {
    loginContext.login();
    // navigate('/jogo');
  }


  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (email) {
      loginContext.tokenLogin(email);
      navegate('/jogo');
    }
  };
  
  return (
    <>
      {loginContext.isLoggedIn || loginContext.token ? (
        <div className="flex items-center justify-center
        h-screen bg-black bg-gradient-r from-blue-500 to-purple-600">
        <h1>Login</h1>
        <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md" onSubmit={handleLogin}>
          <input
            className='border-2 border-black rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-500' 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <button 
            onClick={handleLogin} 
            className='w-100 bg-blue-500'
            type="submit">
              Login
            </button>
        </form>
      </div>
      ) : (
        <div>
          <img src={logo_trivia} alt="Logo do Jogo Trivia" className="w-200 mx-auto animate-pulse" />
          <button 
            onClick={handlePlay}
            className="w-50 m-0 mx-auto blockfull bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            Play
          </button>
        </div>
    )
  }
    </>
  )
}
