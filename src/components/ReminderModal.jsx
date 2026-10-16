import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';

export default function ReminderModal({
  isOpen,
  onClose,
  reminderSettings,
  onSaveReminder
}) {
  const [enabled, setEnabled] = useState(reminderSettings.enabled || false);
  const [reminderTime, setReminderTime] = useState(reminderSettings.time || '20:00');
  const [notificationStatus, setNotificationStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationStatus(perm);
      if (perm === 'granted') {
        setEnabled(true);
      }
    }
  };

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('My Healthy Days 🥗', {
        body: 'Time to record your daily progress! Did you avoid fast food and excess sugar today?',
        icon: '/favicon.svg'
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      alert('Reminder preview: Time to record your daily healthy habits in My Healthy Days!');
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const handleSave = () => {
    onSaveReminder({
      enabled,
      time: reminderTime
    });
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reminder-modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Bell size={20} color="var(--accent-green)" />
            <h3 className="modal-title" id="reminder-modal-title">
              Daily Habit Reminder
            </h3>
          </div>
          <button 
            type="button" 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggle Switch */}
        <div className="switch-toggle-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Enable Reminder</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Get a gentle nudge each day to log your habits
            </div>
          </div>
          <button
            type="button"
            className={`switch-btn ${enabled ? 'active' : ''}`}
            onClick={() => setEnabled(!enabled)}
            aria-label="Toggle daily reminder"
            id="reminder-toggle-switch"
          >
            <div className="switch-knob" />
          </button>
        </div>

        {/* Time Selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="reminder-time-input">
            Reminder Time (Asia/Kolkata IST)
          </label>
          <input
            id="reminder-time-input"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="time-input-field"
            disabled={!enabled}
          />
        </div>

        {/* Browser Permission Info */}
        <div className="detail-item-box">
          <div style={{ fontSize: '0.82rem' }}>
            <span style={{ fontWeight: 600 }}>System Notifications: </span>
            <span style={{ textTransform: 'capitalize' }}>{notificationStatus}</span>
          </div>

          {notificationStatus !== 'granted' && notificationStatus !== 'unsupported' ? (
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
              onClick={handleRequestPermission}
              id="grant-notification-btn"
            >
              Grant Permission
            </button>
          ) : (
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
              <CheckCircle2 size={14} /> Active
            </span>
          )}
        </div>

        {/* Test Notification Button */}
        <div>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.82rem' }}
            onClick={handleTestNotification}
            id="test-notification-btn"
          >
            {testSent ? "Notification Sent! ✓" : "Send Test Notification"}
          </button>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleSave}
            id="save-reminder-btn"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
