import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/login');
  }
  
  return (
    <>
        <h1>Jogo Trivia</h1>
        <button 
          onClick={handlePlay}
          className="w-auto full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play
        </button>
    </>
  )
}
