import { RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard';
import { NewQuiz } from './newQuiz';

export const v1Routes: RouteObject[] = [
  {
    index: true,
    element: <Dashboard />,
  },
  {
    path: 'new-quiz',
    element: <NewQuiz />,
  },
];