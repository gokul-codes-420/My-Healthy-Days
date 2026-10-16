import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthCalendarData, getDayStatus } from '../utils/dateUtils';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarHistory({
  records,
  todayKey,
  onSelectDate
}) {
  const [todayYear, todayMonth] = todayKey.split('-').map(Number);
  
  // State for currently browsed month and year (0-indexed month)
  const [viewYear, setViewYear] = useState(todayYear);
  const [viewMonth, setViewMonth] = useState(todayMonth - 1);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(todayYear);
    setViewMonth(todayMonth - 1);
  };

  const calendarDays = getMonthCalendarData(viewYear, viewMonth);

  return (
    <section className="calendar-section" aria-label="Monthly Habit Calendar History">
      <div className="calendar-header">
        <div className="section-title-wrap">
          <CalendarIcon size={20} color="var(--accent-green)" />
          <h2 className="month-name-display" id="calendar-month-heading">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
        </div>

        <div className="calendar-nav">
          <button
            type="button"
            className="today-jump-btn"
            onClick={handleJumpToToday}
            title="Jump back to current month"
          >
            Today
          </button>
          
          <button
            type="button"
            className="nav-month-btn"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            id="prev-month-btn"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            className="nav-month-btn"
            onClick={handleNextMonth}
            aria-label="Next Month"
            id="next-month-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="calendar-legend" aria-label="Calendar Indicator Legend">
        <div className="legend-item">
          <span className="legend-dot successful" />
          <span>Successful (Both)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot partial" />
          <span>Partial (1 of 2)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot missed" />
          <span>Missed</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot future" />
          <span>Upcoming</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAY_HEADERS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="calendar-grid">
        {calendarDays.map((item, index) => {
          const rec = records[item.dateKey];
          const isToday = item.dateKey === todayKey;
          const status = getDayStatus(rec, item.dateKey, todayKey);
          const isFuture = status === 'future';

          return (
            <button
              type="button"
              key={`${item.dateKey}-${index}`}
              className={`calendar-cell ${item.isPadding ? 'is-padding' : ''} ${isToday ? 'is-today' : ''} ${status}`}
              onClick={() => !isFuture && onSelectDate(item.dateKey)}
              disabled={isFuture}
              title={`${item.dateKey}: ${status}`}
              aria-label={`Date ${item.dateKey}, status: ${status}`}
              id={`cal-cell-${item.dateKey}`}
            >
              <span className="cell-day-num">{item.dayNumber}</span>
              {!isFuture && status !== 'pending' && (
                <span className={`cell-indicator-dot ${status}`} />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
