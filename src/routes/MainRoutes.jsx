import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from 'services/ProtectedRoute';
import User from 'views/pages/users/Users';
import Steps from 'views/pages/users/Questions.jsx/Steps';
import Questions from 'views/pages/users/Questions.jsx/Questions';
import Payments from 'views/pages/payment/Payment';
import SpecifiQuestions from 'views/pages/users/Questions.jsx/SpecifiQuestions'    ;
import Plans from 'views/pages/plans/Plans';
import { element } from 'prop-types';
import Settings from 'views/pages/settings/Settings';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute element={<MainLayout />} />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'users',
      element: <User />
    },
    {
      path: 'steps',
      element: <Steps />
    },
    {
      path: 'questions',
      element: <Questions />
    },
    {
      path: 'payments',
      element: <Payments />
    },
    // {
    //   path: 'details/:id',
    //   element: <SpecifiQuestions />
    // },
    {
      path: 'plans',
      element: <Plans />
    },
    {
      path: 'settings', 
      element : <Settings />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
