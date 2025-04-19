const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController.js');
const verifyRestaurantUserToken = require('../middleware/verifyRestaurantUsersToken');
const verifyAdminCoreToken = require('../middleware/verifyAdminCoreToken');

const AuthUser = require('../models/AuthUser');
router.post('/', verifyAdminCoreToken, controller.createUser);
router.post('/login', controller.login);
router.patch('/', verifyRestaurantUserToken, controller.updateUser);
router.get('/', verifyRestaurantUserToken, controller.getUsers);

// 🧪 Ruta temporal sin token para bootstrap
/* router.post('/setup', async (req, res) => {
    try {
      const { email, password, name, businessId } = req.body;
  
      const exists = await AuthUser.findOne({ email });
      if (exists) return res.status(409).json({ error: 'Ya existe un usuario con ese email' });
  
      const user = new AuthUser({
        email,
        password,
        name,
        businessId,
        isActive: true,
        role: 'admin'
      });
  
      await user.save();
      res.status(201).json({ message: 'Usuario creado exitosamente', userId: user._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }); */
  

module.exports = router;