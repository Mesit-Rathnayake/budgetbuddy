const Setting = require('../models/Setting');

// get currency for authenticated user (fallback to global default if none)
exports.getCurrency = async (req, res) => {
  try {
    let s = await Setting.findOne({ user: req.userId, key: 'currency' });
    if (!s) {
      // fallback: check for a global setting (no user)
      s = await Setting.findOne({ user: null, key: 'currency' });
    }
    if (!s) {
      s = await Setting.create({ user: req.userId, key: 'currency', value: 'USD' });
    }
    return res.json({ currency: s.value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.setCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    if (!currency) return res.status(400).json({ message: 'currency required' });
    const s = await Setting.findOneAndUpdate({ user: req.userId, key: 'currency' }, { value: currency }, { upsert: true, new: true });
    return res.json({ currency: s.value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
