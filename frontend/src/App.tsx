import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRouter } from './router/AppRouter';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ModeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </AuthProvider>
      </ModeProvider>
    </BrowserRouter>
  );
}

export default App;
