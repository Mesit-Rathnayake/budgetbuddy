const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { title, type, targetAmount, category, dueDate } = req.body;
    if (!title || targetAmount == null) return res.status(400).json({ message: 'Missing required fields' });
    const g = new Goal({ title, type, targetAmount, category, dueDate: dueDate ? new Date(dueDate) : undefined });
    await g.save();
    return res.status(201).json(g);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    return res.json(goals);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, targetAmount, category, dueDate } = req.body;
    const updated = await Goal.findByIdAndUpdate(id, { title, type, targetAmount, category, dueDate }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Goal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
