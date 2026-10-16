import React from 'react';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '../utils/quotes';

export default function MotivationalQuoteCard({ todayKey }) {
  const { quote, author } = getDailyQuote(todayKey);

  return (
    <section className="quote-card" aria-label="Daily Motivational Quote">
      <Quote size={20} className="quote-icon" />
      <div className="quote-content">
        <p className="quote-text">“{quote}”</p>
        <span className="quote-author">— {author}</span>
      </div>
    </section>
  );
}
