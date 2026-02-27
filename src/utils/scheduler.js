export const generateSchedule = (data) => {
    const { subjects, dailyHours, startDate } = data;

    // 1. Calculate Priority Scores
    // Formula: (Difficulty * 1.5) + (100 - CurrentGrade) + (Urgency Bonus)
    const today = new Date();

    const subjectsWithScores = subjects.map(subject => {
        let urgencyScore = 0;
        if (subject.examDate) {
            const examDate = new Date(subject.examDate);
            const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
            if (daysUntil > 0) {
                urgencyScore = (1 / daysUntil) * 100; // Higher urgency as date approaches
            }
        }

        const performanceGap = subject.currentGrade ? (100 - parseFloat(subject.currentGrade)) : 50;
        const difficultyScore = subject.difficulty * 1.5;

        // Total raw score
        const rawPriority = difficultyScore + performanceGap + urgencyScore;

        return {
            ...subject,
            rawPriority
        };
    });

    // 2. Normalize Scores and Allocate Time
    const totalPriority = subjectsWithScores.reduce((sum, s) => sum + s.rawPriority, 0);

    const subjectsWithHours = subjectsWithScores.map(subject => {
        // Allocation ratio
        const ratio = subject.rawPriority / totalPriority;
        // Allocated hours per day (rounded to nearest 0.5)
        let allocated = Math.round((ratio * dailyHours) * 2) / 2;
        // Ensure every subject gets at least 0.5 hours if possible, or 0 if priority is super low?
        // Let's enforce minimum 0.5 if allocated is 0 but rawPriority > 0, 
        // unless we exceed dailyHours. Simple version first.
        if (allocated < 0.5) allocated = 0.5;

        return {
            ...subject,
            allocatedHours: allocated
        };
    });

    // Adjust total allocation to match limit (simple normalization adjustment)
    let currentTotal = subjectsWithHours.reduce((sum, s) => sum + s.allocatedHours, 0);

    // If we exceeded hours, shave off from lowest priority or proportional
    // This is a naive adjustment, good enough for V1
    if (currentTotal > dailyHours) {
        // Reduce from the one with most hours
        subjectsWithHours.sort((a, b) => b.allocatedHours - a.allocatedHours);
        let diff = currentTotal - dailyHours;
        let i = 0;
        while (diff > 0 && i < subjectsWithHours.length) {
            if (subjectsWithHours[i].allocatedHours > 0.5) {
                subjectsWithHours[i].allocatedHours -= 0.5;
                diff -= 0.5;
            } else {
                i++;
            }
        }
    }

    // 3. Generate Weekly Plan (7 Days)
    const weeklySchedule = [];
    // Use provided strtDate or default to tomorrow
    const startDay = startDate ? new Date(startDate) : new Date();
    if (!startDate) startDay.setDate(startDay.getDate() + 1);

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startDay);
        currentDay.setDate(startDay.getDate() + i);

        // Format date: "Monday, Dec 25"
        const dateString = currentDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        // Creating slots for the day
        // We shuffle subjects slightly for variety or keep consistent? 
        // Let's keep consistent daily routine for habit building, but maybe rotate start times?
        // For V1: Static daily routine based on allocation.

        let startTime = 18; // Default start 6 PM (18:00) - customizable? 
        // Assuming after school/work. Let's start a generic "Study Session 1"

        let currentHour = 0;

        // Distribute slots logic
        let dailySlots = [];

        // 1. Create Splitted Slots
        subjectsWithHours.forEach(subject => {
            if (subject.allocatedHours <= 0) return;

            // Logic: If difficulty is High (>6) AND Duration is long (> 1.5 hours)
            // We split it into smaller chunks (max 1.5 hours per chunk)
            if (subject.difficulty > 6 && subject.allocatedHours > 1.5) {
                const chunkCount = Math.ceil(subject.allocatedHours / 1.5);
                const durationPerChunk = Number((subject.allocatedHours / chunkCount).toFixed(1));

                for (let i = 0; i < chunkCount; i++) {
                    dailySlots.push({
                        subject: subject.name,
                        duration: durationPerChunk,
                        color: getRandomColor(subject.name),
                        splitIndex: i + 1,
                        totalSplits: chunkCount,
                        isHighDifficulty: true
                    });
                }
            } else {
                // Normal allocation
                dailySlots.push({
                    subject: subject.name,
                    duration: subject.allocatedHours,
                    color: getRandomColor(subject.name)
                });
            }
        });

        // 2. Interleave/Shuffle slots to avoid burnout
        // Simple shuffle to prevent back-to-back same subjects if possible
        // We sort by 'splitIndex' roughly or just random shuffle? 
        // Let's do a smart interleave: Put all Split 1s, then others, then Split 2s...
        // Actually, a simple sort by "remaining priority" is often good, but let's just shuffle deterministically.

        // Simple algorithm: Group by subject, then round-robin pick
        // (This is a quick implementation of round-robin interleaving)
        let orderedSlots = [];
        let groups = {};
        dailySlots.forEach(s => {
            if (!groups[s.subject]) groups[s.subject] = [];
            groups[s.subject].push(s);
        });

        let maxLen = 0;
        Object.values(groups).forEach(g => maxLen = Math.max(maxLen, g.length));

        for (let j = 0; j < maxLen; j++) {
            Object.keys(groups).forEach(key => {
                if (groups[key][j]) orderedSlots.push(groups[key][j]);
            });
        }

        // Assign time of day simulation
        // Start at 6:00 PM (18.0)
        let currentTime = 18.0;

        const slotsWithTime = orderedSlots.map(slot => {
            const startH = Math.floor(currentTime);
            const startM = Math.round((currentTime - startH) * 60);
            const endT = currentTime + slot.duration;
            const endH = Math.floor(endT);
            const endM = Math.round((endT - endH) * 60);

            // Format time 12h
            const formatTime = (h, m) => {
                const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
            };

            const timeRange = `${formatTime(startH, startM)} - ${formatTime(endH, endM)}`;
            currentTime = endT; // Update for next slot

            return { ...slot, timeRange };
        });

        weeklySchedule.push({
            day: dateString,
            dateObj: currentDay, // useful for sorting or checking
            slots: slotsWithTime,
            totalHours: subjectsWithHours.reduce((acc, curr) => acc + curr.allocatedHours, 0)
        });
    }

    return {
        summary: subjectsWithHours,
        weekly: weeklySchedule
    };
};

const getRandomColor = (str) => {
    // Generate consistent VIBRANT color from string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use HSL for vibrant colors: Saturation 80-100%, Lightness 60-70%
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 85%, 65%)`;
};
