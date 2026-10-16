import React from 'react';
import { Check, X, Clock, Minus } from 'lucide-react';
import { getWeeklyDays, getDayStatus } from '../utils/dateUtils';

export default function WeeklySummary({ records, todayKey, onSelectDate }) {
  const weekDays = getWeeklyDays(todayKey);

  return (
    <section className="weekly-summary-section" aria-label="Current Week Summary">
      <div>
        <h3 className="section-title">This Week's Snapshot</h3>
        <p className="section-subtext">Click any day to view its detailed habit status.</p>
      </div>

      <div className="week-grid">
        {weekDays.map((day) => {
          const rec = records[day.dateKey];
          const status = getDayStatus(rec, day.dateKey, todayKey);
          
          return (
            <div
              key={day.dateKey}
              className={`week-day-cell ${day.isToday ? 'is-today' : ''} ${status}`}
              onClick={() => onSelectDate(day.dateKey)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDate(day.dateKey);
                }
              }}
              title={`${day.dayLabel}, ${day.dayNumber}: ${status}`}
              id={`weekly-day-${day.dateKey}`}
            >
              <span className="week-day-label">{day.dayLabel}</span>
              <span className="week-day-number">{day.dayNumber}</span>
              
              <div className={`week-day-badge ${status}`}>
                {status === 'successful' && <Check size={12} strokeWidth={3} />}
                {status === 'partial' && <Minus size={12} strokeWidth={3} />}
                {status === 'missed' && <X size={12} strokeWidth={3} />}
                {status === 'pending' && <Clock size={11} />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
