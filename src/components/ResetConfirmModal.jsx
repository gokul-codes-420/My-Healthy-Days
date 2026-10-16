import React from 'react';
import { AlertTriangle, X, Trash2, Sparkles } from 'lucide-react';

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirmReset,
  onLoadDemoData
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <AlertTriangle size={22} color="var(--accent-red)" />
            <h3 className="modal-title" id="reset-modal-title">
              Reset Tracker Data
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

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to reset all tracked habits and streak data? This will clear all historical days and start fresh.
        </p>

        <div className="detail-item-box" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--accent-green)" />
            <span>Need sample data to evaluate?</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            You can populate a 14-day history with an active 10-day streak to test calendar badges, weekly summaries, and monthly stats immediately.
          </p>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.82rem' }}
            onClick={() => {
              onLoadDemoData();
              onClose();
            }}
            id="load-demo-data-btn"
          >
            Load 14-Day Sample Demo Data
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger flex items-center gap-1.5"
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            id="confirm-reset-btn"
          >
            <Trash2 size={15} />
            <span>Yes, Reset All Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
