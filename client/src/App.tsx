import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ChatPage from './pages/chat';
import HomePage from './pages/home';
import NotFoundPage from './pages/404';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatPage/:id" element={<ChatPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
