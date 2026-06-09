import { useEffect, useState, useContext } from 'react';
import LoginContext from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Question } from '../types/question';

// Interface estendida para incluir as respostas embaralhadas
interface QuestionWithShuffled extends Question {
  all_answers: string[];
}

export default function Jogo() {
  const loginContext = useContext(LoginContext);
  const token = loginContext.token;
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<QuestionWithShuffled[]>([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Lógica de pontos: Easy=10, Medium=20, Hard=30
  const getPoints = (difficulty: string) => {
    const weights: Record<string, number> = { easy: 10, medium: 20, hard: 30 };
    return weights[difficulty] || 10;
  };

  function fetchQuestions() {
    axios.get(`https://opentdb.com/api.php?amount=2&token=${token}`)
      .then((response) => {
        if (response.data.response_code === 3) {
          // Token expirado
          localStorage.removeItem('token');
          navigate('/jogo');
          return;
        }

        // Criamos um novo array com as respostas já embaralhadas para cada pergunta
        const results = response.data.results.map((q: Question) => ({
          ...q,
          all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        }));
        setQuestions(results);
      })
      .catch((error) => {
        console.error('Erro ao buscar perguntas:', error);
      });
  }

  const handleAnswerClick = (selectedAnswer: string, difficulty: string, correct: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(selectedAnswer);

    if (selectedAnswer === correct) {
      setScore((prev) => prev + getPoints(difficulty));
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTimer(10);
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchQuestions();
  }, [token, navigate]);

  useEffect(() => {
    if (questions.length > 0 && !isAnswered && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsAnswered(true); // Bloqueia as respostas quando o tempo acaba
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [questions.length, isAnswered, timer]);

  if (questions.length === 0) return <div className="text-center p-10">Carregando perguntas...</div>;

  const isGameOver = currentQuestionIndex >= questions.length;

  if (isGameOver) {
    return (
      <main className="p-4 max-w-xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Fim de Jogo!</h1>
        <p className="text-xl mb-8">Sua pontuação final foi: <span className="text-yellow-500 font-bold">{score}</span></p>
        <button 
          onClick={() => {
            loginContext.logout();
            navigate('/')}
          }
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Voltar ao Início
        </button>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-8 bg-slate-800 text-white p-4 rounded-lg shadow">
        <h1 className="text-xl font-bold">Trivia Challenge</h1>
        <div className={`text-xl font-mono ${timer < 4 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          Tempo: {timer}s
        </div>
        <div className="text-lg">Pontuação: <span className="font-mono text-yellow-400">{score}</span></div>
      </header>

      <div className="p-6 border rounded-xl shadow-md bg-white">
        <div className="flex justify-between text-sm text-slate-900 mb-2">
          <span>{currentQuestion.category}</span>
          <span className="capitalize font-bold">Dificuldade: {currentQuestion.difficulty}</span>
        </div>
        <h3 className="text-xl text-slate-900 font-bold mb-6 antialiased" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.all_answers.map((answer, aIdx) => {
            const isCorrect = answer === currentQuestion.correct_answer;
            const isSelected = selectedAnswer === answer;

            let btnClass = "p-4 rounded-lg border-2 transition-all text-left font-medium ";
            
            if (!isAnswered) {
              btnClass += "border-gray-200 hover:border-blue-500 hover:bg-blue-50";
            } else {
              if (isCorrect) {
                btnClass += "bg-green-100 border-green-500 text-green-800";
              } else if (isSelected) {
                btnClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                btnClass += "bg-gray-50 border-gray-100 text-gray-400 opacity-50";
              }
            }

            return (
              <button
                key={aIdx}
                disabled={isAnswered}
                onClick={() => handleAnswerClick(answer, currentQuestion.difficulty, currentQuestion.correct_answer)}
                className={btnClass}
              >
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="mt-8 w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
          </button>
        )}
      </div>
    </main>
  )
}
