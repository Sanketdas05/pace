// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { GamificationProvider } from './context/GamificationContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ReviewProvider } from './context/ReviewContext.jsx';
import { AIProvider } from './context/AIContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GamificationProvider>
            <TaskProvider>
              <NotificationProvider>
                <ReviewProvider>
                  <AIProvider>
                    <App />
                  </AIProvider>
                </ReviewProvider>
              </NotificationProvider>
            </TaskProvider>
          </GamificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
