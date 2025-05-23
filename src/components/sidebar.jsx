import React from 'react';
import './sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, darkMode, setDarkMode }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Personal Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </li>
        <li 
          className={activeTab === 'calendar' ? 'active' : ''} 
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </li>
        <li 
          className={activeTab === 'todo' ? 'active' : ''} 
          onClick={() => setActiveTab('todo')}
        >
          Tasks
        </li>
        <li 
          className={activeTab === 'notes' ? 'active' : ''} 
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;