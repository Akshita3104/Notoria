import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import CalendarPage from './components/calendar';
import TodoPage from './components/todo';
import NotesPage from './components/notes';
import './app.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <CalendarPage />;
      case 'todo':
        return <TodoPage />;
      case 'notes':
        return <NotesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;