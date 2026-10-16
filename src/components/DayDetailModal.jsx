import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Edit3, 
  Save, 
  Utensils, 
  CandyOff,
  ShieldAlert
} from 'lucide-react';
import { formatDateKey, getDayStatus } from '../utils/dateUtils';

function DayDetailContent({
  dateKey,
  todayKey,
  record,
  onClose,
  onSavePastRecord
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [fastFoodStatus, setFastFoodStatus] = useState(() => record?.fastFood || 'pending');
  const [sugarStatus, setSugarStatus] = useState(() => record?.sugar || 'pending');
  const [showConfirmWarning, setShowConfirmWarning] = useState(false);

  const isToday = dateKey === todayKey;
  const currentStatus = getDayStatus(record, dateKey, todayKey);

  const handleStartEdit = () => {
    setIsEditing(true);
    setShowConfirmWarning(true);
  };

  const handleSave = () => {
    onSavePastRecord(dateKey, {
      fastFood: fastFoodStatus,
      sugar: sugarStatus,
      savedAt: `Manually updated at ${new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })} IST`
    });
    setIsEditing(false);
    setShowConfirmWarning(false);
    onClose();
  };

  return (
    <div className="modal-card">
      <div className="modal-header">
        <div className="modal-title-wrap">
          <Calendar size={20} color="var(--accent-green)" />
          <h3 className="modal-title" id="day-detail-title">
            {formatDateKey(dateKey)}
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

      {/* Status Tag */}
      <div className="detail-item-box">
        <span className="detail-label">Overall Day Status:</span>
        <span className={`status-pill ${currentStatus}`}>
          {currentStatus.toUpperCase()}
        </span>
      </div>

      {/* Protection Warning if editing past date */}
      {showConfirmWarning && !isToday && (
        <div className="warning-callout">
          <ShieldAlert size={18} className="flex-shrink-0" />
          <div>
            <strong>Historical Record Protection:</strong> Modifying past dates changes your recorded streak history. Please confirm your intentional edit.
          </div>
        </div>
      )}

      {/* Habit 1 View or Edit */}
      <div className="detail-item-box">
        <div className="flex items-center gap-2">
          <Utensils size={16} />
          <span className="detail-label">1. Avoided Fast Food:</span>
        </div>

        {isEditing ? (
          <div className="habit-toggle-group" style={{ padding: '2px' }}>
            <button
              type="button"
              className={`toggle-option-btn ${fastFoodStatus === 'completed' ? 'active completed' : ''}`}
              onClick={() => setFastFoodStatus('completed')}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-option-btn ${fastFoodStatus === 'failed' ? 'active failed' : ''}`}
              onClick={() => setFastFoodStatus('failed')}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
            >
              No
            </button>
          </div>
        ) : (
          <span className={`status-pill ${fastFoodStatus}`}>
            {fastFoodStatus === 'failed' ? 'Not Completed' : fastFoodStatus}
          </span>
        )}
      </div>

      {/* Habit 2 View or Edit */}
      <div className="detail-item-box">
        <div className="flex items-center gap-2">
          <CandyOff size={16} />
          <span className="detail-label">2. Avoided Excess Sugar:</span>
        </div>

        {isEditing ? (
          <div className="habit-toggle-group" style={{ padding: '2px' }}>
            <button
              type="button"
              className={`toggle-option-btn ${sugarStatus === 'completed' ? 'active completed' : ''}`}
              onClick={() => setSugarStatus('completed')}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-option-btn ${sugarStatus === 'failed' ? 'active failed' : ''}`}
              onClick={() => setSugarStatus('failed')}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
            >
              No
            </button>
          </div>
        ) : (
          <span className={`status-pill ${sugarStatus}`}>
            {sugarStatus === 'failed' ? 'Not Completed' : sugarStatus}
          </span>
        )}
      </div>

      {/* Saved At Info */}
      {record?.savedAt && (
        <div className="detail-item-box" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> Logged:
          </span>
          <span>{record.savedAt}</span>
        </div>
      )}

      {/* Action Controls */}
      <div className="modal-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary flex items-center gap-1.5"
              onClick={handleSave}
              id="confirm-edit-save-btn"
            >
              <Save size={15} />
              <span>Save Correction</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-primary flex items-center gap-1.5"
              onClick={handleStartEdit}
              id="enable-edit-btn"
            >
              <Edit3 size={15} />
              <span>{isToday ? "Edit Today" : "Edit Record"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function DayDetailModal({
  dateKey,
  todayKey,
  record,
  isOpen,
  onClose,
  onSavePastRecord
}) {
  if (!isOpen || !dateKey) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="day-detail-title">
      <DayDetailContent
        key={`${dateKey}-${record?.updatedAt || ''}`}
        dateKey={dateKey}
        todayKey={todayKey}
        record={record}
        onClose={onClose}
        onSavePastRecord={onSavePastRecord}
      />
    </div>
  );
}
