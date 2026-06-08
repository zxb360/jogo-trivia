import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Question } from '../types/question';

export default function Jogo() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([
    {
      category: '',
      type: '',
      difficulty: '',
      question: '',
      correct_answer: '',
      incorrect_answers: [''],
    },
  ]);
  
  function fetchQuestions() {
    axios.get(`https://opentdb.com/api.php?amount=3&token=${token}`)
      .then((response) => {
        response.data.results.forEach((question: Question) => {
          setQuestions((prevQuestions) => [...prevQuestions, question]);
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar perguntas:', error);
      });
  }
        // Lógica para lidar com as perguntas recebidas
  useEffect(() => {
    if (!token) {
      // Redirecionar para a página de login se o token não estiver presente
      navigate('/login');
    }
    fetchQuestions();

  }, [token, navigate]);

  return (
    <>
      <h1>Responda as Perguntas</h1>
      {questions.map((question: Question, index) => (
        <div key={index}>
          <h2>{question.question}</h2>
          <ul>
            {question.incorrect_answers.map((answer, idx) => (
              <li key={idx}>{answer}</li>
            ))}
            <li>{question.correct_answer}</li>
          </ul>
        </div>
      ))}
    </>
  )
}
