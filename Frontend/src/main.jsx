import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    </React.StrictMode>,
);
