import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import QuestionCard from './components/QuestionCard';
import { QuestionsState, Difficulty } from './API';
//styles
import { Style, Wrapper } from './App.styles';


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTION = 10;

const App = () => {
  const [Loading, setLoading] = useState(false);
  const [Questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(Questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );
    setQuestions(newQuestions);

    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //U answer
      const answer = e.currentTarget.value;
      //check correct answer
      const correct = Questions[number].correct_answer === answer;
      // add score if correct
      if (correct) setScore(prev => prev + 1);
      //save answer in arr
      const AnswerObject = {
        question: Questions[number].question,
        answer,
        correct,
        correctAnswer: Questions[number].correct_answer,

      };
      setUserAnswers(prev => [...prev, AnswerObject])
    }
  };
  const nextQuestion = () => {
    //next Q if not last
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);

    } else {
      setNumber(nextQuestion);
    }

  }


  return (
    <>
      <Style />
      <Wrapper>
        <h1>QUICK QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          < button className='start' onClick={startTrivia}>
            start

          </button>
        ) : null
        }

        {!gameOver ? <p className='score'>Score: {score}</p> : null}
        {Loading && <p>Loading Questions ...</p>}
        {!Loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={Questions[number].question}
            answers={Questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />)}

        {!gameOver && !Loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (
          <button className='next' onClick={nextQuestion}>nextQuestion
          </button>
        ) : null}
      </Wrapper >
    </>
  );
}

export default App;
