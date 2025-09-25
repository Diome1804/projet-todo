import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TaskPage from '../pages/TaskPage';
import HistoryPage from '../pages/HistoryPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PermissionsPage from '../pages/PermissionsPage';
import ActionsPage from '../pages/ActionsPage';
import TaskDetail from '../pages/TaskDetail';
import TaskFormPage from '../pages/TaskFormPage';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/tasks" element={<TaskPage />} />
      <Route path="/tasks/new" element={<TaskFormPage />} />
      <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
      <Route path="/tasks/:id" element={<TaskDetail />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/permissions" element={<PermissionsPage />} />
      <Route path="/actions" element={<ActionsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRouter;
