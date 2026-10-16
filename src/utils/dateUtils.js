// Date and Timezone Utilities for Asia/Kolkata (IST)

export const TIMEZONE = 'Asia/Kolkata';

/**
 * Returns today's date in YYYY-MM-DD format according to Asia/Kolkata timezone
 */
export function getISTTodayKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date); // Outputs YYYY-MM-DD
}

/**
 * Formats a Date object into live time string: "07:30:15 PM" in Asia/Kolkata
 */
export function getISTLiveTime(date = new Date()) {
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  return timeFormatter.format(date);
}

/**
 * Formats today's date nicely: "Friday, 16 October 2026"
 */
export function formatISTFullDate(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return formatter.format(date);
}

/**
 * Formats a YYYY-MM-DD string into readable display: "Oct 16, 2026"
 */
export function formatDateKey(dateKey) {
  if (!dateKey) return '';
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Formats a YYYY-MM-DD string into day and month: "16 Oct"
 */
export function formatShortDate(dateKey) {
  if (!dateKey) return '';
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Offset dateKey by deltaDays (e.g. -1 for yesterday, +1 for tomorrow)
 */
export function offsetDateKey(dateKey, deltaDays) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Determine the status of a specific day record
 * Returns: 'successful' | 'partial' | 'missed' | 'pending' | 'future'
 */
export function getDayStatus(record, dateKey, todayKey) {
  if (dateKey > todayKey) {
    return 'future';
  }

  if (!record) {
    if (dateKey === todayKey) return 'pending';
    return 'missed'; // Past untracked day
  }

  const { fastFood, sugar } = record;

  if (fastFood === 'completed' && sugar === 'completed') {
    return 'successful';
  }

  if (dateKey === todayKey) {
    if (fastFood === 'failed' || sugar === 'failed') {
      if (fastFood === 'completed' || sugar === 'completed') {
        return 'partial';
      }
      return 'missed';
    }
    if (fastFood === 'completed' || sugar === 'completed') {
      return 'partial';
    }
    return 'pending';
  }

  // Past day
  if (fastFood === 'completed' || sugar === 'completed') {
    return 'partial';
  }
  return 'missed';
}

/**
 * Checks if a record counts as fully successful (both habits completed)
 */
export function isDaySuccessful(record) {
  return record && record.fastFood === 'completed' && record.sugar === 'completed';
}

/**
 * Calculate Streaks and Statistics
 */
export function calculateStats(records = {}, todayKey = getISTTodayKey()) {
  const todayRecord = records[todayKey];
  const isTodayCompleted = isDaySuccessful(todayRecord);
  const isTodayFailed = todayRecord && (todayRecord.fastFood === 'failed' || todayRecord.sugar === 'failed');

  // 1. Current Streak calculation
  let currentStreak = 0;
  if (isTodayCompleted) {
    currentStreak = 1;
    let checkDate = offsetDateKey(todayKey, -1);
    while (isDaySuccessful(records[checkDate])) {
      currentStreak++;
      checkDate = offsetDateKey(checkDate, -1);
    }
  } else if (!isTodayFailed) {
    // Today is still pending/unfinalized: check if yesterday ended a streak
    let checkDate = offsetDateKey(todayKey, -1);
    while (isDaySuccessful(records[checkDate])) {
      currentStreak++;
      checkDate = offsetDateKey(checkDate, -1);
    }
  } else {
    // Today was failed: streak resets to 0
    currentStreak = 0;
  }

  // 2. Total Successful Days
  let totalSuccessfulDays = 0;
  let totalRecordedDays = 0;
  const recordedDates = Object.keys(records).sort();

  recordedDates.forEach((dateKey) => {
    const rec = records[dateKey];
    if (rec && (rec.fastFood !== 'pending' || rec.sugar !== 'pending')) {
      totalRecordedDays++;
    }
    if (isDaySuccessful(rec)) {
      totalSuccessfulDays++;
    }
  });

  // 3. Best Streak (maximum consecutive successful days in history)
  let bestStreak = currentStreak;
  if (recordedDates.length > 0) {
    let run = 0;
    // Walk day by day from the earliest record up to today
    let pointer = recordedDates[0];
    const end = todayKey;

    while (pointer <= end) {
      if (isDaySuccessful(records[pointer])) {
        run++;
        if (run > bestStreak) bestStreak = run;
      } else {
        run = 0;
      }
      pointer = offsetDateKey(pointer, 1);
    }
  }

  // 4. Monthly Progress (for the current IST month)
  const [currentYearStr, currentMonthStr, currentDayStr] = todayKey.split('-');
  const currentDay = Number(currentDayStr);

  let monthlySuccessfulDays = 0;
  for (let d = 1; d <= currentDay; d++) {
    const dStr = String(d).padStart(2, '0');
    const dKey = `${currentYearStr}-${currentMonthStr}-${dStr}`;
    if (isDaySuccessful(records[dKey])) {
      monthlySuccessfulDays++;
    }
  }

  const monthlyProgressPercent = currentDay > 0
    ? Math.round((monthlySuccessfulDays / currentDay) * 100)
    : 0;

  // 5. Overall Success Percentage
  const overallSuccessRate = totalRecordedDays > 0
    ? Math.round((totalSuccessfulDays / totalRecordedDays) * 100)
    : 0;

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalSuccessfulDays,
    totalRecordedDays,
    monthlySuccessfulDays,
    monthlyElapsedDays: currentDay,
    monthlyProgressPercent,
    overallSuccessRate,
    isTodayCompleted
  };
}

/**
 * Returns days for a given calendar month view (including leading blanks for day of week)
 */
export function getMonthCalendarData(year, monthIndex) {
  // monthIndex is 0-based (0 = January)
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
  const startingDayOfWeek = firstDayOfMonth.getUTCDay(); // 0 = Sunday
  
  // Last day of month
  const lastDayOfMonth = new Date(Date.UTC(year, monthIndex + 1, 0));
  const totalDays = lastDayOfMonth.getUTCDate();

  const days = [];
  // Add padding days from previous month
  const prevMonthLastDay = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonth = monthIndex === 0 ? 12 : monthIndex;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    const dateKey = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      dayNumber: d,
      dateKey,
      isCurrentMonth: false,
      isPadding: true
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const mStr = String(monthIndex + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateKey = `${year}-${mStr}-${dStr}`;
    days.push({
      dayNumber: d,
      dateKey,
      isCurrentMonth: true,
      isPadding: false
    });
  }

  // Trailing padding to fill complete grid of 35 or 42 cells
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextMonth = monthIndex === 11 ? 1 : monthIndex + 2;
    const nextYear = monthIndex === 11 ? year + 1 : year;
    const dateKey = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      dayNumber: i,
      dateKey,
      isCurrentMonth: false,
      isPadding: true
    });
  }

  return days;
}

/**
 * Returns the 7 days of the current week (Monday to Sunday) containing targetDateKey
 */
export function getWeeklyDays(targetDateKey) {
  const [y, m, d] = targetDateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  
  // 0 = Sun, 1 = Mon ... 6 = Sat. We want Monday as start (0) to Sunday (6).
  const dayOfWeek = (date.getUTCDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const offset = i - dayOfWeek;
    const k = offsetDateKey(targetDateKey, offset);
    const [ky, km, kd] = k.split('-').map(Number);
    const dayDate = new Date(Date.UTC(ky, km - 1, kd, 12, 0, 0));
    const dayLabel = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' }).format(dayDate);
    week.push({
      dateKey: k,
      dayNumber: kd,
      dayLabel,
      isToday: k === targetDateKey
    });
  }
  return week;
}
