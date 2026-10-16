import React from 'react';
import { Flame, Trophy, CheckCircle2, Calendar } from 'lucide-react';

export default function DashboardStats({ stats }) {
  const {
    currentStreak = 0,
    bestStreak = 0,
    totalSuccessfulDays = 0,
    monthlySuccessfulDays = 0,
    monthlyElapsedDays = 1,
    monthlyProgressPercent = 0,
    overallSuccessRate = 0
  } = stats || {};

  return (
    <section className="stats-grid" aria-label="Habit Progress Statistics">
      {/* Current Streak */}
      <div className="stat-card" id="stat-current-streak">
        <div className="stat-header">
          <span className="stat-label">Current Streak</span>
          <div className="stat-icon amber">
            <Flame size={16} />
          </div>
        </div>
        <div className="stat-value">
          {currentStreak}
          <span className="stat-unit">{currentStreak === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="stat-subtext">
          {currentStreak > 0 ? 'Consecutive healthy days!' : 'Start your streak today'}
        </div>
      </div>

      {/* Best Streak */}
      <div className="stat-card" id="stat-best-streak">
        <div className="stat-header">
          <span className="stat-label">Best Streak</span>
          <div className="stat-icon green">
            <Trophy size={16} />
          </div>
        </div>
        <div className="stat-value">
          {bestStreak}
          <span className="stat-unit">{bestStreak === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="stat-subtext">
          Personal all-time record
        </div>
      </div>

      {/* Monthly Progress */}
      <div className="stat-card" id="stat-monthly-progress">
        <div className="stat-header">
          <span className="stat-label">Monthly Progress</span>
          <div className="stat-icon blue">
            <Calendar size={16} />
          </div>
        </div>
        <div className="stat-value">
          {monthlySuccessfulDays}
          <span className="stat-unit">/ {monthlyElapsedDays} days</span>
        </div>
        <div className="stat-progress-bar" title={`${monthlyProgressPercent}% completed this month`}>
          <div 
            className="stat-progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, monthlyProgressPercent))}%` }}
          />
        </div>
        <div className="stat-subtext">
          {monthlyProgressPercent}% this month
        </div>
      </div>

      {/* Total & Overall Success Rate */}
      <div className="stat-card" id="stat-overall-success">
        <div className="stat-header">
          <span className="stat-label">Total Success</span>
          <div className="stat-icon green">
            <CheckCircle2 size={16} />
          </div>
        </div>
        <div className="stat-value">
          {totalSuccessfulDays}
          <span className="stat-unit">days</span>
        </div>
        <div className="stat-progress-bar" title={`${overallSuccessRate}% overall success rate`}>
          <div 
            className="stat-progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, overallSuccessRate))}%` }}
          />
        </div>
        <div className="stat-subtext">
          {overallSuccessRate}% overall rate
        </div>
      </div>
    </section>
  );
}
