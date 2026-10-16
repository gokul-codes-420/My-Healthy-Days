import React from 'react';
import { 
  Check, 
  X, 
  Clock, 
  Save, 
  RotateCcw, 
  Utensils, 
  CandyOff, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function HabitChecklist({
  fastFoodStatus,
  sugarStatus,
  onChangeFastFood,
  onChangeSugar,
  onSaveProgress,
  onUndoToday,
  isDirty,
  lastSavedAt
}) {
  return (
    <section className="checklist-section" aria-label="Daily Habit Checklist">
      <div className="checklist-header">
        <div className="section-title-wrap">
          <CheckCircle2 size={22} color="var(--accent-green)" />
          <h2 className="section-title">Today's Healthy Habits</h2>
        </div>

        {lastSavedAt && (
          <div className="save-timestamp-badge" id="last-saved-timestamp">
            <Clock size={13} />
            <span>{lastSavedAt}</span>
          </div>
        )}
      </div>

      <div className="habits-container">
        {/* Habit 1: Avoided Fast Food */}
        <div 
          className={`habit-card ${fastFoodStatus}`}
          id="habit-card-fast-food"
        >
          <div className="habit-main">
            <div className="habit-info">
              <div className="habit-symbol" aria-hidden="true">
                <Utensils size={20} />
              </div>
              <div className="habit-text-wrap">
                <h3 className="habit-title">1. Avoided Fast Food Today</h3>
                <p className="habit-desc">
                  Skipped deep-fried items, takeout burgers, fries, pizza, and processed oily snacks.
                </p>
              </div>
            </div>

            <span className={`status-pill ${fastFoodStatus}`} id="fast-food-status-pill">
              {fastFoodStatus === 'completed' && <Check size={12} strokeWidth={3} />}
              {fastFoodStatus === 'failed' && <X size={12} strokeWidth={3} />}
              {fastFoodStatus === 'pending' && <Clock size={12} />}
              <span>{fastFoodStatus === 'failed' ? 'Not Completed' : fastFoodStatus}</span>
            </span>
          </div>

          {/* Three-State Selector */}
          <div className="habit-toggle-group" role="group" aria-label="Fast Food Habit Status">
            <button
              type="button"
              className={`toggle-option-btn ${fastFoodStatus === 'pending' ? 'active pending' : ''}`}
              onClick={() => onChangeFastFood('pending')}
              id="fastfood-pending-btn"
            >
              <Clock size={15} />
              <span>Pending</span>
            </button>

            <button
              type="button"
              className={`toggle-option-btn ${fastFoodStatus === 'completed' ? 'active completed' : ''}`}
              onClick={() => onChangeFastFood('completed')}
              id="fastfood-completed-btn"
            >
              <Check size={15} strokeWidth={2.5} />
              <span>Completed</span>
            </button>

            <button
              type="button"
              className={`toggle-option-btn ${fastFoodStatus === 'failed' ? 'active failed' : ''}`}
              onClick={() => onChangeFastFood('failed')}
              id="fastfood-failed-btn"
            >
              <X size={15} strokeWidth={2.5} />
              <span>Not Completed</span>
            </button>
          </div>
        </div>

        {/* Habit 2: Avoided Excess Sugar */}
        <div 
          className={`habit-card ${sugarStatus}`}
          id="habit-card-sugar"
        >
          <div className="habit-main">
            <div className="habit-info">
              <div className="habit-symbol" aria-hidden="true">
                <CandyOff size={20} />
              </div>
              <div className="habit-text-wrap">
                <h3 className="habit-title">2. Avoided Excess Sugar Today</h3>
                <p className="habit-desc">
                  Stayed clear of sugary sodas, packaged pastries, candy, sweet desserts, and added syrups.
                </p>
              </div>
            </div>

            <span className={`status-pill ${sugarStatus}`} id="sugar-status-pill">
              {sugarStatus === 'completed' && <Check size={12} strokeWidth={3} />}
              {sugarStatus === 'failed' && <X size={12} strokeWidth={3} />}
              {sugarStatus === 'pending' && <Clock size={12} />}
              <span>{sugarStatus === 'failed' ? 'Not Completed' : sugarStatus}</span>
            </span>
          </div>

          {/* Three-State Selector */}
          <div className="habit-toggle-group" role="group" aria-label="Excess Sugar Habit Status">
            <button
              type="button"
              className={`toggle-option-btn ${sugarStatus === 'pending' ? 'active pending' : ''}`}
              onClick={() => onChangeSugar('pending')}
              id="sugar-pending-btn"
            >
              <Clock size={15} />
              <span>Pending</span>
            </button>

            <button
              type="button"
              className={`toggle-option-btn ${sugarStatus === 'completed' ? 'active completed' : ''}`}
              onClick={() => onChangeSugar('completed')}
              id="sugar-completed-btn"
            >
              <Check size={15} strokeWidth={2.5} />
              <span>Completed</span>
            </button>

            <button
              type="button"
              className={`toggle-option-btn ${sugarStatus === 'failed' ? 'active failed' : ''}`}
              onClick={() => onChangeSugar('failed')}
              id="sugar-failed-btn"
            >
              <X size={15} strokeWidth={2.5} />
              <span>Not Completed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Checklist Action Buttons */}
      <div className="checklist-actions">
        <div className="honesty-notice">
          <Info size={14} />
          <span>Record honestly. Every day tracked builds self-trust.</span>
        </div>

        <div className="action-buttons-group">
          <button
            type="button"
            className="undo-btn"
            onClick={onUndoToday}
            title="Reset today's entry to pending or undo unsaved changes"
            id="undo-today-btn"
          >
            <RotateCcw size={15} />
            <span>Undo / Reset Today</span>
          </button>

          <button
            type="button"
            className={`save-btn ${!isDirty && lastSavedAt ? 'is-saved' : ''}`}
            onClick={onSaveProgress}
            id="save-daily-progress-btn"
          >
            <Save size={16} />
            <span>{isDirty ? "Save Daily Progress" : "Saved ✓ (Update)"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
