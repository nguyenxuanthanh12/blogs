import App from '../App';
import InfoUser from '../Pages/InfoUser/InfoUser';
import LoginUser from '../Pages/LoginUser/LoginUser';
import RegisterUser from '../Pages/RegisterUser/RegisterUser';
import ManagerUser from '../Pages/ManagerUser/ManagerUser';
export const publicRoutes = [
    { path: '/', component: <App /> },
    { path: '/login', component: <LoginUser /> },
    { path: '/register', component: <RegisterUser /> },
    { path: '/info-user', component: <InfoUser /> },
    { path: '/manager-user', component: <ManagerUser /> },
];
