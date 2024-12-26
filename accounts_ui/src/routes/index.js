import Home from '~/pages/Home';
import Login from '~/pages/Auth/Login';
import Register from '~/pages/Auth/Register';
import Setting from '~/pages/Setting';
import VerifyAccount from '~/pages/VerifyAccount';
import SettingPage from '~/pages/Setting/Page/SettingPage';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/verify-account', component: VerifyAccount },
    {
        path: '/settings',
        component: Setting,
        children: [
            { path: 'personal', component: SettingPage },
            { path: 'security', component: SettingPage },
        ],
    },
];

export default routes;
