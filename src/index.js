import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter , Routes, Route,} from "react-router-dom";
import './index.css';
import App from './App';
import AuthView from './views/auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/auth' element={<AuthView />} />
        </Routes>
    </BrowserRouter>
);
