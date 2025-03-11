import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import Ex1 from '../pages/ex1';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import App from '../App';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'ex1',
        element: <Ex1 />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

export default router;