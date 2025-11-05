const Setting = require('../models/Setting');

exports.getCurrency = async (req, res) => {
  try {
    let s = await Setting.findOne({ key: 'currency' });
    if (!s) {
      s = await Setting.create({ key: 'currency', value: 'USD' });
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
    const s = await Setting.findOneAndUpdate({ key: 'currency' }, { value: currency }, { upsert: true, new: true });
    return res.json({ currency: s.value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
