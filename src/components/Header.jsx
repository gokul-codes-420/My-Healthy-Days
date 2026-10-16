import React from 'react';
import { ShieldCheck, Sun, Moon, Bell, RotateCcw } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onOpenReminder, 
  onOpenReset,
  reminderEnabled 
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon" aria-hidden="true">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="brand-title">My Healthy Days</h1>
            <p className="brand-subtitle">Fast Food & Sugar-Free Habit Tracker</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            type="button"
            className="icon-btn"
            onClick={onOpenReminder}
            title={reminderEnabled ? "Daily Reminder Active" : "Set Daily Reminder"}
            aria-label="Daily Reminder Settings"
            id="reminder-btn"
          >
            <Bell size={18} color={reminderEnabled ? "var(--accent-green)" : "currentColor"} />
          </button>

          <button 
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            type="button"
            className="icon-btn"
            onClick={onOpenReset}
            title="Reset or Load Demo Data"
            aria-label="Reset Progress Data"
            id="reset-data-btn"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
