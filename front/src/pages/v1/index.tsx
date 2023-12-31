import { RouteObject } from 'react-router-dom';
import { Response } from '../response';
import { Dashboard } from './dashboard';
import { NewQuiz } from './newQuiz';
import { QuizDetails } from './quiz';

export const v1Routes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: 'new-quiz',
    element: <NewQuiz />,
  },
  {
    path: 'quiz/:quizId',
    element: <QuizDetails />,
  },
  {
    path: 'quiz/:quizId/preview',
    element: <Response preview />,
  },
];
