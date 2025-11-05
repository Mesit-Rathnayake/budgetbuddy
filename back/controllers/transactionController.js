const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, note } = req.body;
    if (!type || (type !== 'income' && type !== 'expense')) return res.status(400).json({ message: 'Invalid type' });
    if (amount == null || !category || !date) return res.status(400).json({ message: 'Missing required fields' });

    const tx = new Transaction({ type, amount, category, date: new Date(date), note });
    await tx.save();
    return res.status(201).json(tx);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.listTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && (type === 'income' || type === 'expense')) filter.type = type;
    const txs = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    return res.json(txs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, date, note } = req.body;
    const updated = await Transaction.findByIdAndUpdate(id, { type, amount, category, date, note }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
