import React, { useState, useEffect } from 'react';
import './dashboard.css';
import MusicPlayer from './MusicPlayer';

const Dashboard = () => {
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [dailyGoals, setDailyGoals] = useState(() => {
    const saved = localStorage.getItem('dailyGoals');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Complete morning workout', completed: false },
      { id: 2, text: 'Finish project proposal', completed: false }
    ];
  });
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    localStorage.setItem('dailyGoals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setTimer(25 * 60);
    setIsActive(false);
  };

  const addGoal = () => {
    if (newGoal.trim() === '') return;
    const newGoalItem = {
      id: Date.now(),
      text: newGoal,
      completed: false
    };
    setDailyGoals([...dailyGoals, newGoalItem]);
    setNewGoal('');
  };

  const toggleGoal = (id) => {
    setDailyGoals(dailyGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setDailyGoals(dailyGoals.filter(goal => goal.id !== id));
  };

  return (
    <div className="dashboard">
  <div className="welcome-section">
    <h1>Welcome Back!</h1>
    <p>Let's make today productive</p>
  </div>

  <div className="top-section">
    <div className="focus-section">
      <h2>Focus Time</h2>
      <div className="timer">{formatTime(timer)}</div>
      <div className="timer-controls">
        <button onClick={handleStart}>{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>

    <div className="music-player">
      <MusicPlayer />      
    </div>
  </div>

  <div className="daily-goals">
    <h2>Daily Goals</h2>
    <div className="goal-input">
      <input 
        type="text" 
        value={newGoal} 
        onChange={(e) => setNewGoal(e.target.value)} 
        placeholder="Add a new goal..." 
      />
      <button onClick={addGoal}>Add</button>
    </div>
    <ul className="goals-list">
      {dailyGoals.map(goal => (
        <li key={goal.id} className={goal.completed ? 'completed' : ''}>
          <input 
            type="checkbox" 
            checked={goal.completed} 
            onChange={() => toggleGoal(goal.id)} 
          />
          <span>{goal.text}</span>
          <button onClick={() => deleteGoal(goal.id)}> × </button>
        </li>
      ))}
    </ul>
  </div>
</div>
);
};

export default Dashboard;