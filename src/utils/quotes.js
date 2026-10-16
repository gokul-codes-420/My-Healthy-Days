// Curated daily motivational quotes focused on clean eating, overcoming cravings, and consistent healthy habits
export const HEALTH_QUOTES = [
  {
    quote: "Every time you choose nourishment over convenience, you cast a vote for the person you want to become.",
    author: "James Clear (adapted)"
  },
  {
    quote: "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    author: "Ann Wigmore"
  },
  {
    quote: "Craving is just a feeling. It peaks like a wave, and if you let it pass without reacting, you win every time.",
    author: "Mindful Living"
  },
  {
    quote: "You don't have to be extreme, just consistent. Two good choices today protect your tomorrow.",
    author: "Habit Wisdom"
  },
  {
    quote: "Fast food gives you 10 minutes of pleasure and hours of sluggish energy. Fresh choices give you vitality all day.",
    author: "Nutrition Principle"
  },
  {
    quote: "Sugar is an illusion of quick joy. Real sustained energy comes from wholesome, real food.",
    author: "Dr. Robert Lustig"
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    quote: "Small daily disciplines repeated consistently lead to great achievements gained slowly over time.",
    author: "John C. Maxwell"
  },
  {
    quote: "Your body is your only permanent home. Treat it with reverence and feed it with care.",
    author: "Jim Rohn"
  },
  {
    quote: "A craving lasts on average only 15 minutes. Take a glass of water, breathe, and let it fade.",
    author: "Mindful Health"
  },
  {
    quote: "Self-control is strength. Right thought is mastery. Calmness is power.",
    author: "James Allen"
  },
  {
    quote: "When you conquer your morning and afternoon cravings, your evening feels light and victorious.",
    author: "Daily Habit Rule"
  },
  {
    quote: "Eat food that will rot, but eat it before it does. Avoid packaged sugars and artificial shortcuts.",
    author: "Michael Pollan"
  },
  {
    quote: "Success starts with the quiet decision to skip the fries and pass on the sweet drink.",
    author: "Healthy Days Motto"
  },
  {
    quote: "The greatest wealth is health. Guard it one meal at a time.",
    author: "Virgil"
  },
  {
    quote: "Don't trade your long-term wellness for temporary sweetness.",
    author: "Wellness Philosophy"
  },
  {
    quote: "Clean eating is not a restriction; it is an act of deep self-respect.",
    author: "Holistic Health"
  },
  {
    quote: "Consistency isn't about never having a hard day; it's about holding the line today.",
    author: "Habit Tracker Insight"
  },
  {
    quote: "When you resist junk food once, the next resistance becomes twice as easy.",
    author: "Neuroscience of Habits"
  },
  {
    quote: "Nourish your mind with focus, and nourish your body with pure, honest food.",
    author: "Ayurvedic Proverb"
  },
  {
    quote: "Take care of your body today so your future self can thank you tomorrow.",
    author: "Daily Reminder"
  }
];

export function getDailyQuote(dateKey) {
  if (!dateKey) return HEALTH_QUOTES[0];
  // Deterministic quote per day based on dateKey string hash
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % HEALTH_QUOTES.length;
  return HEALTH_QUOTES[index];
}
