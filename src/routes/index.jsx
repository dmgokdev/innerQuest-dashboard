import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';

const router = createBrowserRouter([MainRoutes, LoginRoutes]);

export default router;
