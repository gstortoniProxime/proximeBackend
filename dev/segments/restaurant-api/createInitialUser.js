require('dotenv').config();
const mongoose = require('mongoose');
const AuthUser = require('./src/models/AuthUser'); // Ajustá si tu path es distinto

const run = async () => {
  try {
    console.log('🧠 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'restaurant_db',
    });
    console.log('✅ Conectado a Mongo');

    const exists = await AuthUser.findOne({ email: 'admin@burgerking.com' });
    if (exists) {
      console.log('⚠️ Usuario ya existe. No se crea uno nuevo.');
    } else {
      const user = new AuthUser({
        name: 'Guillermo Stortoni',
      email: 'gstortoni@starsap.com',
      password: 'Potente69', // se encripta en el pre-save
      businessId: '67fec6c0a90839c364d4c658', // usá un ObjectId válido si ya tenés uno
      isActive: true,
      role: 'admin' // o lo que uses en tu modelo
      });

      await user.save();
      console.log('✅ Usuario inicial creado exitosamente');
    }

    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada. Fin del script.');
    process.exit(0);
  } catch (err) {
    console.error('💥 Error:', err);
    process.exit(1);
  }
};

run();