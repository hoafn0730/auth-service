import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import routes from './routes';
import Reload from '~/pages/Reload';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.component;

                        return <Route key={index} path={route.path} element={<Page />} />;
                    })}
                    <Route path={'/reload'} element={<Reload />} />;
                </Routes>
            </Router>
        </div>
    );
}

export default App;
