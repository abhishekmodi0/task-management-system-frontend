import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from './_helpers';
import { Nav, Alert, PrivateRoute } from './_components';
import { Home } from 'home';
import { Profile } from 'profile';
import { AccountLayout } from './account/';
import { ProjectsLayout } from './projects'


export { App };

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="container pt-4 pb-4">
                <Routes>
                    {/* private */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="project/*" element={<ProjectsLayout />} >
                        </Route>
                    </Route>
                    {/* public */}
                    <Route path="account/*" element={<AccountLayout />} />
                    <Route path="*" element={<Navigate to="/" replace/>} />
                </Routes>
            </div>
        </div>
    );
}