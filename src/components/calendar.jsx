import React, { useState, useEffect } from 'react';
import './calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    description: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    const year = clickedDate.getFullYear();
    const month = (clickedDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = clickedDate.getDate().toString().padStart(2, '0');

    setNewEvent({
      title: '',
      date: `${year}-${month}-${dayStr}`,
      description: ''
    });
    setEditingEventId(null);
    setShowModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedDate(new Date(event.date));
    setNewEvent({
      title: event.title,
      date: event.date,
      description: event.description
    });
    setEditingEventId(event.id);
    setShowModal(true);
  };

  const handleAddOrUpdateEvent = () => {
    if (newEvent.title.trim() === '') return;

    if (editingEventId) {
      setEvents(events.map(ev => 
        ev.id === editingEventId ? { ...ev, ...newEvent } : ev
      ));
    } else {
      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');

      const dateStr = `${year}-${month}-${day}`;

      const event = {
        id: Date.now(),
        ...newEvent,
        date: dateStr
      };
      setEvents([...events, event]);
    }
    setNewEvent({
      title: '',
      date: '',
      description: ''
    });
    setEditingEventId(null);
    setShowModal(false);
  };

  const handleDeleteEvent = () => {
    if (editingEventId) {
      setEvents(events.filter(ev => ev.id !== editingEventId));
      setShowModal(false);
      setEditingEventId(null);
      setNewEvent({
        title: '',
        date: '',
        description: ''
      });
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);

      days.push(
        <div
          key={`day-${day}`}
          className="calendar-day"
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          {dayEvents.length > 0 && (
            <div className="event-indicator" style={{cursor: 'pointer'}}>
              <span onClick={(e) => handleEventClick(dayEvents[0], e)}>
                {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Filter events for currently viewed month for display below calendar
  const eventsThisMonth = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === currentDate.getFullYear() &&
      eventDate.getMonth() === currentDate.getMonth()
    );
  });

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>←</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekday">Sun</div>
        <div className="calendar-weekday">Mon</div>
        <div className="calendar-weekday">Tue</div>
        <div className="calendar-weekday">Wed</div>
        <div className="calendar-weekday">Thu</div>
        <div className="calendar-weekday">Fri</div>
        <div className="calendar-weekday">Sat</div>
        {renderCalendar()}
      </div>

      {/* Scheduled events list below calendar */}
      <div className="events-list">
        <h3>Scheduled Events for {currentDate.toLocaleString('default', { month: 'long' })}</h3>
        {eventsThisMonth.length === 0 && <p>No events scheduled.</p>}
        <ul>
          {eventsThisMonth.map(event => (
            <li 
              key={event.id} 
              onClick={(e) => handleEventClick(event, e)}
              style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              title={`Edit event on ${event.date}`}
            >
              <strong>{event.date}:</strong> {event.title}
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingEventId ? 'Edit Event' : 'Add Event'} for {selectedDate.toLocaleDateString()}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Event description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
            <div className="modal-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAddOrUpdateEvent}>
                {editingEventId ? 'Update Event' : 'Add Event'}
              </button>
              {editingEventId && (
                <button onClick={handleDeleteEvent} style={{ backgroundColor: '#e74c3c', color: '#fff' }}>
                  Delete Event
                </button>
              )}
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
