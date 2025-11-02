// Simple summary controller returning mock summary data.
exports.getSummary = (req, res) => {
  // In a real app you'd compute these from the DB per-user.
  const data = {
    expensesThisMonth: 1234.56,
    recentChange: 9.4,
    activeGoals: 2,
    achievedGoals: 1,
  };

  res.json(data);
};
