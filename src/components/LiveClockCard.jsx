import React, { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { getISTLiveTime, formatISTFullDate } from '../utils/dateUtils';

export default function LiveClockCard() {
  const [currentTime, setCurrentTime] = useState(() => getISTLiveTime());
  const [currentDateStr, setCurrentDateStr] = useState(() => formatISTFullDate());

  useEffect(() => {
    // Update live clock every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(getISTLiveTime(now));
      setCurrentDateStr(formatISTFullDate(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="live-clock-card" aria-label="Current Date and Live Time">
      <div className="clock-info">
        <div className="timezone-pill">
          <MapPin size={12} />
          <span>Asia/Kolkata (IST)</span>
        </div>
        <h2 className="current-date-title" id="current-ist-date">
          {currentDateStr}
        </h2>
      </div>

      <div className="clock-digital-box" aria-label="Live Indian Standard Time">
        <Clock size={18} className="stat-icon-clock" />
        <span className="digital-time" id="live-digital-clock">
          {currentTime}
        </span>
        <span className="time-pulse" aria-hidden="true" title="Clock updating in real-time"></span>
      </div>
    </section>
  );
}
