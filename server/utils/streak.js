// utils/streak.js

function calculateStreak(lastLogin, currentStreak) {
  if (!lastLogin) return 1;

  const last = new Date(lastLogin);
  const now = new Date();

  // normalize to dates only
  last.setHours(0,0,0,0);
  now.setHours(0,0,0,0);

  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // same day → no change
    return currentStreak;
  } else if (diffDays === 1) {
    // consecutive day → increment
    return currentStreak + 1;
  } else {
    // missed a day → reset
    return 1;
  }
}

module.exports = { calculateStreak };