import React, { useState, useEffect } from 'react';
import './notes.css';

const NotesPage = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [activeNote, setActiveNote] = useState(null);
  const [isEditingNew, setIsEditingNew] = useState(false);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const startNewNote = () => {
    setNewNote({ title: '', content: '' });
    setActiveNote(null);
    setIsEditingNew(true);
  };

  const addNote = () => {
    if (newNote.title.trim() === '' || newNote.content.trim() === '') return;
    const note = {
      id: Date.now(),
      ...newNote,
      createdAt: new Date().toISOString()
    };
    setNotes([...notes, note]);
    setNewNote({ title: '', content: '' });
    setActiveNote(note.id);
    setIsEditingNew(false);
  };

  const updateNote = () => {
    if (!activeNote) return;
    setNotes(notes.map(note =>
      note.id === activeNote ? { ...note, ...newNote } : note
    ));
  };

  const deleteNote = () => {
    if (!activeNote) return;
    setNotes(notes.filter(note => note.id !== activeNote));
    setActiveNote(null);
    setNewNote({ title: '', content: '' });
    setIsEditingNew(false);
  };

  const handleNoteClick = (note) => {
    setActiveNote(note.id);
    setNewNote({
      title: note.title,
      content: note.content
    });
    setIsEditingNew(false);
  };

  return (
    <div className="notes-page">
      <div className="notes-sidebar">
        <h2>Notes</h2>
        <button onClick={startNewNote}>New Note</button>
        <ul className="notes-list">
          {notes.map(note => (
            <li
              key={note.id}
              className={activeNote === note.id ? 'active' : ''}
              onClick={() => handleNoteClick(note)}
            >
              <h4>{note.title}</h4>
              <p>{new Date(note.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="notes-editor">
        {(activeNote !== null || isEditingNew) ? (
          <>
            <input
              type="text"
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <div className="editor-buttons">
              {isEditingNew ? (
                <button onClick={addNote}>Add</button>
              ) : (
                <>
                  <button onClick={updateNote}>Update</button>
                  <button onClick={deleteNote}>Delete</button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="empty-editor">
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
