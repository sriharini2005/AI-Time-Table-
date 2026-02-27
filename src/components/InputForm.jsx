import React, { useState } from 'react';

const InputForm = ({ onGenerate }) => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', difficulty: 5, examDate: '', currentGrade: '' }
  ]);
  const [dailyHours, setDailyHours] = useState(4);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

  const addSubject = () => {
    setSubjects([...subjects, {
      id: Date.now(),
      name: '',
      difficulty: 5,
      examDate: '',
      currentGrade: ''
    }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subjects.some(s => !s.name)) {
      alert('Please fill in all subject names');
      return;
    }
    onGenerate({ subjects, dailyHours, startDate });
  };

  return (
    <div className="glass animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Configure Your Study Plan</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid-cols-2" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          <div>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ fontSize: '1.1rem' }}
            />
          </div>
          <div>
            <label htmlFor="dailyHours">Daily Study Hours</label>
            <input
              type="number"
              id="dailyHours"
              min="1"
              max="16"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseInt(e.target.value))}
              style={{ fontSize: '1.1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subjects.map((subject, index) => (
            <div key={subject.id} className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Subject {index + 1}</h3>
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(subject.id)}
                    style={{ padding: '4px 12px', background: 'rgba(255,50,50,0.2)', fontSize: '0.8rem' }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label>Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label>Exam Date</label>
                  <input
                    type="date"
                    value={subject.examDate}
                    onChange={(e) => updateSubject(subject.id, 'examDate', e.target.value)}
                  />
                </div>
                <div>
                  <label>Current Performance (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 75"
                    min="0"
                    max="100"
                    value={subject.currentGrade}
                    onChange={(e) => updateSubject(subject.id, 'currentGrade', e.target.value)}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>Difficulty Level</label>
                    <span style={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}>{subject.difficulty}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={subject.difficulty}
                    onChange={(e) => updateSubject(subject.id, 'difficulty', parseInt(e.target.value))}
                    style={{ padding: 0, background: 'transparent', border: 'none', height: '40px', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button type="button" onClick={addSubject} className="secondary">
            + Add Another Subject
          </button>
          <button type="submit" style={{ width: '200px' }}>
            Generate Schedule ✨
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
