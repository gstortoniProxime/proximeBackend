const jwt = require('jsonwebtoken');
const AuthUser = require('../models/AuthUser');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthUser.findOne({ email }).populate('businessId');
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, businessId: user.businessId._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};