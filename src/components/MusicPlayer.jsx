import React, { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const playlist = [
    { title: 'Focus Beats', file: '/focus-beats.mp3' },
    { title: 'Chill Lofi', file: '/chill-lofi.mp3' },
    { title: 'Ambient Flow', file: '/ambient-flow.mp3' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const currentTrack = playlist[currentIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    setCurrentIndex((currentIndex + 1) % playlist.length);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    if (isPlaying) audio.play();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [isPlaying, currentIndex]);

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const styles = {  
    heading: {
      fontSize: '28px',
      fontWeight: '600',
      textAlign: 'left',
      marginBottom: '28px',
    },
    trackInfo: {
      textAlign: 'center',
      marginBottom: '28px',
    },
    trackTitle: {
      fontSize: '24px',
      color: '#f3e8ff',
      marginBottom: '6px',
    },
    trackSubtitle: {
      fontSize: '14px',
      color: '#d8b4fe',
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '60px',
      marginBottom: '20px',
    },
    controlBtn: {
      fontSize: '28px',
      color: '#d8b4fe',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s',
    },
    playBtn: {
      backgroundColor: '#a855f7',
      color: 'white',
      padding: '10px 30px',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    progressContainer: {
      width: '90%',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    timeLabel: {
      color: '#e9d5ff',
      fontSize: '12px',
      minWidth: '40px',
      textAlign: 'center',
    },
    slider: {
      flex: 1,
      appearance: 'none',
      height: '4px',
      background: '#c084fc',
      borderRadius: '2px',
      outline: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Music Player</h2>

      <div style={styles.trackInfo}>
        <div style={styles.trackTitle}>{currentTrack.title}</div>
        <div style={styles.trackSubtitle}>Lofi Focus Playlist</div>
      </div>

      <div style={styles.controls}>
        <button style={styles.controlBtn} onClick={playPrevious}>⏮️</button>
        <button style={styles.playBtn} onClick={togglePlay}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button style={styles.controlBtn} onClick={playNext}>⏭️</button>
      </div>

      <div style={styles.progressContainer}>
        <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          style={styles.slider}
        />
        <span style={styles.timeLabel}>{formatTime(duration)}</span>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.file}
        preload="auto"
        onEnded={playNext}
      />
    </div>
  );
};

export default MusicPlayer;
