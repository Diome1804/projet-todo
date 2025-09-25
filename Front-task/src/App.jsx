import React, { useRef } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

import Navigation from './components/ui/Navigation';
import { TaskProvider } from './context/TaskContext';

function App() {
  const taskRef = useRef();

  const handleLoginSuccess = () => {
    if (taskRef.current) {
      taskRef.current.initializeTasks();
    }
  };

  return (
    <TaskProvider ref={taskRef}>
      <AuthProvider onLoginSuccess={handleLoginSuccess}>
        <Router>
          <div className="App">
            <Navigation />
            <AppRouter />
          </div>
        </Router>
      </AuthProvider>
    </TaskProvider>
  );
}

export default App;
