import React from 'react';

const Timetable = ({ schedule, onReset }) => {
    const { summary, weekly } = schedule;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Summary Dashboard */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ textAlign: 'center' }}>Your Optimized Study Plan</h2>
                <div className="grid-cols-2">
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
                        <h3>Priority Analysis</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {summary.map(s => (
                                <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    <span>{s.name}</span>
                                    <span style={{ fontWeight: 'bold', color: '#ffb' }}>{s.allocatedHours} hrs/day</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'hsl(var(--accent))' }}>
                            {summary.reduce((a, b) => a + b.allocatedHours, 0)}
                        </div>
                        <div>Total Daily Hours</div>
                    </div>
                </div>
            </div>

            {/* Exam Reminders Section */}
            <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '5px solid #ff4757' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    🔔 Upcoming Exams
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {summary.filter(s => s.examDate).sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).map(s => {
                        const diff = Math.ceil((new Date(s.examDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return (
                            <div key={s.id} style={{
                                background: 'rgba(255,255,255,0.1)',
                                padding: '12px 20px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column', // Stack vertically
                                gap: '4px',
                                minWidth: '200px'
                            }}>
                                <strong style={{ fontSize: '1.05rem', wordBreak: 'break-word' }}>{s.name}</strong>
                                <span style={{ color: diff < 3 ? '#ff6b6b' : '#4ecdc4', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    {diff} days left ({s.examDate})
                                </span>
                            </div>
                        )
                    })}
                    {!summary.some(s => s.examDate) && <p style={{ opacity: 0.7 }}>No upcoming exams configured.</p>}
                </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Weekly Routine 📅</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    {weekly.map((dayPlan, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '15px',
                            padding: '1rem',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h4 style={{
                                color: 'white',
                                marginBottom: '0.5rem',
                                textAlign: 'center',
                                fontSize: '1.1rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                paddingBottom: '0.5rem'
                            }}>
                                {dayPlan.day.split(',')[0]} <br />
                                <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 'normal' }}>{dayPlan.day.split(',').slice(1).join(',')}</span>
                            </h4>
                            {dayPlan.slots.map((slot, sIdx) => (
                                <div key={sIdx} style={{
                                    background: slot.color,
                                    padding: '0.8rem',
                                    borderRadius: '10px',
                                    marginBottom: '0.8rem',
                                    color: '#1a1a1a',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}>
                                    <div>📚 {slot.subject}</div>
                                    <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: '600' }}>
                                        ⏰ {slot.timeRange}
                                        <span style={{ opacity: 0.7, fontWeight: '400', marginLeft: '6px' }}>({slot.duration}h)</span>
                                    </div>
                                    {slot.isHighDifficulty && <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.8 }}>⚡ Intensive Focus</div>}
                                </div>
                            ))}
                            {dayPlan.slots.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center' }}>Rest Day</div>}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={onReset} className="secondary">
                    Create New Schedule
                </button>
            </div>

        </div>
    );
};

export default Timetable;
