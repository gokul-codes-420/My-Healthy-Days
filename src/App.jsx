import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import LiveClockCard from './components/LiveClockCard';
import DashboardStats from './components/DashboardStats';
import MotivationalQuoteCard from './components/MotivationalQuoteCard';
import HabitChecklist from './components/HabitChecklist';
import WeeklySummary from './components/WeeklySummary';
import CalendarHistory from './components/CalendarHistory';
import DayDetailModal from './components/DayDetailModal';
import CongratulationsModal from './components/CongratulationsModal';
import ReminderModal from './components/ReminderModal';
import ResetConfirmModal from './components/ResetConfirmModal';

import { 
  getISTTodayKey, 
  getISTLiveTime, 
  calculateStats
} from './utils/dateUtils';

import { 
  loadRecords, 
  saveRecords, 
  loadSettings, 
  saveSettings, 
  clearAllData, 
  generateDemoData 
} from './utils/storage';

export default function App() {
  // 1. Persistent Records & Settings State
  const [records, setRecords] = useState(() => loadRecords());
  const [settings, setSettings] = useState(() => loadSettings());

  // 2. IST Today Key
  const [todayKey, setTodayKey] = useState(() => getISTTodayKey());

  // 3. Local Draft State for Today's Habits
  const todayRecord = records[todayKey];
  const [fastFoodStatus, setFastFoodStatus] = useState(() => todayRecord?.fastFood || 'pending');
  const [sugarStatus, setSugarStatus] = useState(() => todayRecord?.sugar || 'pending');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(() => todayRecord?.savedAt || null);

  // 4. Modal States
  const [isCongratsOpen, setIsCongratsOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [isDayDetailOpen, setIsDayDetailOpen] = useState(false);

  // Keep todayKey synced in case user leaves tab open past midnight IST
  useEffect(() => {
    const checkDateInterval = setInterval(() => {
      const currentISTKey = getISTTodayKey();
      if (currentISTKey !== todayKey) {
        setTodayKey(currentISTKey);
        const newTodayRec = records[currentISTKey];
        setFastFoodStatus(newTodayRec?.fastFood || 'pending');
        setSugarStatus(newTodayRec?.sugar || 'pending');
        setLastSavedAt(newTodayRec?.savedAt || null);
        setIsDirty(false);
      }
    }, 30000); // check every 30s
    return () => clearInterval(checkDateInterval);
  }, [todayKey, records]);

  // Apply Theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');
    saveSettings(settings);
  }, [settings]);

  // Save records to localStorage whenever updated
  const persistRecords = useCallback((newRecords) => {
    setRecords(newRecords);
    saveRecords(newRecords);
  }, []);

  // Calculate Streaks & Dashboard Metrics
  const stats = useMemo(() => {
    return calculateStats(records, todayKey);
  }, [records, todayKey]);

  // Theme Toggle Handler
  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Change Fast Food status handler
  const handleChangeFastFood = (newStatus) => {
    setFastFoodStatus(newStatus);
    setIsDirty(true);
  };

  // Change Sugar status handler
  const handleChangeSugar = (newStatus) => {
    setSugarStatus(newStatus);
    setIsDirty(true);
  };

  // Save Progress Handler
  const handleSaveProgress = () => {
    const timeStr = getISTLiveTime();
    const savedTimeLabel = `Saved at ${timeStr} IST`;

    const wasAlreadyCelebrated = todayRecord?.celebrated || false;
    const isNowBothCompleted = fastFoodStatus === 'completed' && sugarStatus === 'completed';

    const shouldCelebrate = isNowBothCompleted && !wasAlreadyCelebrated;

    const updatedRecord = {
      date: todayKey,
      fastFood: fastFoodStatus,
      sugar: sugarStatus,
      savedAt: savedTimeLabel,
      updatedAt: new Date().toISOString(),
      celebrated: wasAlreadyCelebrated || shouldCelebrate
    };

    const newRecords = {
      ...records,
      [todayKey]: updatedRecord
    };

    persistRecords(newRecords);
    setLastSavedAt(savedTimeLabel);
    setIsDirty(false);

    if (shouldCelebrate) {
      setIsCongratsOpen(true);
    }
  };

  // Undo / Reset today's draft handler
  const handleUndoToday = () => {
    if (todayRecord) {
      // Revert to saved record
      setFastFoodStatus(todayRecord.fastFood || 'pending');
      setSugarStatus(todayRecord.sugar || 'pending');
      setIsDirty(false);
    } else {
      // Reset to pending
      setFastFoodStatus('pending');
      setSugarStatus('pending');
      setIsDirty(false);
    }
  };

  // Open inspection modal for a given date
  const handleSelectDate = (dateKey) => {
    setSelectedDateKey(dateKey);
    setIsDayDetailOpen(true);
  };

  // Save historical date record from modal
  const handleSavePastRecord = (targetDateKey, updatedData) => {
    const existing = records[targetDateKey] || {};
    const updatedRecord = {
      ...existing,
      date: targetDateKey,
      fastFood: updatedData.fastFood,
      sugar: updatedData.sugar,
      savedAt: updatedData.savedAt,
      updatedAt: new Date().toISOString(),
      celebrated: updatedData.fastFood === 'completed' && updatedData.sugar === 'completed'
    };

    const newRecords = {
      ...records,
      [targetDateKey]: updatedRecord
    };

    persistRecords(newRecords);

    // If the edited date is today, sync today's draft
    if (targetDateKey === todayKey) {
      setFastFoodStatus(updatedData.fastFood);
      setSugarStatus(updatedData.sugar);
      setLastSavedAt(updatedData.savedAt);
      setIsDirty(false);
    }
  };

  // Reset all progress
  const handleConfirmReset = () => {
    clearAllData();
    setRecords({});
    setFastFoodStatus('pending');
    setSugarStatus('pending');
    setLastSavedAt(null);
    setIsDirty(false);
  };

  // Load demo data
  const handleLoadDemoData = () => {
    const demo = generateDemoData(todayKey);
    persistRecords(demo);
    if (demo[todayKey]) {
      setFastFoodStatus(demo[todayKey].fastFood || 'pending');
      setSugarStatus(demo[todayKey].sugar || 'pending');
      setLastSavedAt(demo[todayKey].savedAt || null);
    } else {
      setFastFoodStatus('pending');
      setSugarStatus('pending');
      setLastSavedAt(null);
    }
    setIsDirty(false);
  };

  // Save Reminder settings
  const handleSaveReminder = (newReminder) => {
    setSettings((prev) => ({
      ...prev,
      reminder: {
        ...prev.reminder,
        ...newReminder
      }
    }));
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onOpenReminder={() => setIsReminderOpen(true)}
        onOpenReset={() => setIsResetOpen(true)}
        reminderEnabled={settings.reminder?.enabled}
      />

      <main className="content-wrapper">
        {/* 1. Current Day, Date & Live Clock */}
        <LiveClockCard />

        {/* 2. Motivational Daily Quote */}
        <MotivationalQuoteCard todayKey={todayKey} />

        {/* 3. Dashboard Stats (Current Streak, Best Streak, Monthly, Total) */}
        <DashboardStats stats={stats} />

        {/* 4. Daily Habit Checklist (Fast Food & Sugar) */}
        <HabitChecklist
          fastFoodStatus={fastFoodStatus}
          sugarStatus={sugarStatus}
          onChangeFastFood={handleChangeFastFood}
          onChangeSugar={handleChangeSugar}
          onSaveProgress={handleSaveProgress}
          onUndoToday={handleUndoToday}
          isDirty={isDirty}
          lastSavedAt={lastSavedAt}
        />

        {/* 5. Weekly Summary */}
        <WeeklySummary
          records={records}
          todayKey={todayKey}
          onSelectDate={handleSelectDate}
        />

        {/* 6. Calendar & History */}
        <CalendarHistory
          records={records}
          todayKey={todayKey}
          onSelectDate={handleSelectDate}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <strong>My Healthy Days</strong> — Daily habits for mindful living.
          </div>
          <div className="footer-links">
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setIsResetOpen(true)}
            >
              Reset Data / Load Sample Demo
            </button>
            <span>•</span>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => setIsReminderOpen(true)}
            >
              Reminder Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CongratulationsModal
        isOpen={isCongratsOpen}
        onClose={() => setIsCongratsOpen(false)}
        currentStreak={stats.currentStreak}
        totalSuccessfulDays={stats.totalSuccessfulDays}
      />

      <DayDetailModal
        isOpen={isDayDetailOpen}
        onClose={() => setIsDayDetailOpen(false)}
        dateKey={selectedDateKey}
        todayKey={todayKey}
        record={selectedDateKey ? records[selectedDateKey] : null}
        onSavePastRecord={handleSavePastRecord}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        reminderSettings={settings.reminder || {}}
        onSaveReminder={handleSaveReminder}
      />

      <ResetConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirmReset={handleConfirmReset}
        onLoadDemoData={handleLoadDemoData}
      />
    </div>
  );
}
