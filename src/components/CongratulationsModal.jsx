import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, CheckCircle, X } from 'lucide-react';

export default function CongratulationsModal({
  isOpen,
  onClose,
  currentStreak,
  totalSuccessfulDays
}) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#38bdf8'],
          ticks: 220,
          gravity: 0.85,
          scalar: 0.95,
          disableForReducedMotion: true
        });
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="congrats-modal-title"
    >
      <div className="modal-card congrats-modal">
        <button 
          type="button" 
          className="close-btn" 
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          onClick={onClose}
          aria-label="Close celebration modal"
        >
          <X size={18} />
        </button>

        <div className="congrats-trophy-ring" aria-hidden="true">
          <Award size={36} />
        </div>

        <div>
          <h2 className="congrats-title" id="congrats-modal-title">
            Congratulations! 🎉
          </h2>
          <p className="congrats-message">
            Great job! You completed today's healthy goals! You avoided both fast food and excess sugar today.
          </p>
        </div>

        <div className="streak-highlight-card">
          <div className="streak-highlight-item">
            <span className="streak-highlight-val flex items-center gap-1">
              <Flame size={20} color="var(--accent-amber)" />
              {currentStreak}
            </span>
            <span className="streak-highlight-lbl">Day Streak</span>
          </div>

          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

          <div className="streak-highlight-item">
            <span className="streak-highlight-val flex items-center gap-1">
              <CheckCircle size={20} color="var(--accent-green)" />
              {totalSuccessfulDays}
            </span>
            <span className="streak-highlight-lbl">Total Days Won</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          onClick={onClose}
          id="congrats-dismiss-btn"
        >
          Keep Up the Momentum!
        </button>
      </div>
    </div>
  );
}
