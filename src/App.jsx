import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Timetable from './components/Timetable';
import { generateSchedule } from './utils/scheduler';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [theme, setTheme] = useState('vibrant'); // 'vibrant', 'lofi', 'dark'

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleGenerate = (data) => {
    const generated = generateSchedule(data);
    setSchedule(generated);
  };

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100, display: 'flex', gap: '8px' }}>
        <button onClick={() => setTheme('vibrant')} style={{ padding: '8px 12px', fontSize: '0.8rem', opacity: theme === 'vibrant' ? 1 : 0.6 }}>🎨 Vibrant</button>
        <button onClick={() => setTheme('lofi')} style={{ padding: '8px 12px', fontSize: '0.8rem', opacity: theme === 'lofi' ? 1 : 0.6 }}>☕ Study/Lofi</button>
        <button onClick={() => setTheme('dark')} style={{ padding: '8px 12px', fontSize: '0.8rem', opacity: theme === 'dark' ? 1 : 0.6 }}>🌙 Dark</button>
      </div>

      <header>
        <h1>AI Study Architect</h1>
      </header>

      <main>
        {!schedule ? (
          <InputForm onGenerate={handleGenerate} />
        ) : (
          <Timetable schedule={schedule} onReset={() => setSchedule(null)} />
        )}
      </main>
    </div>
  );
}

export default App;
