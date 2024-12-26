import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import routes from './routes';
import Reload from '~/pages/Reload';
import { doGetAccount } from './store/actions/authAction';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // if (!userInfo) {
        dispatch(doGetAccount());
        // }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.component;

                        return (
                            <Route key={index} path={route.path} element={<Page />}>
                                {route.children &&
                                    route.children.map((routeChild, index) => {
                                        const PageChild = routeChild.component;
                                        return <Route key={index} path={routeChild.path} element={<PageChild />} />;
                                    })}
                            </Route>
                        );
                    })}
                    <Route path={'/reload'} element={<Reload />} />;
                </Routes>
            </Router>
        </div>
    );
}

export default App;
