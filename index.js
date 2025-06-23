require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const petRoutes = require('./routes/pet.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const ownerRoutes = require('./routes/owner.routes');
const speciesRoutes = require('./routes/species.routes');
const breedRoutes = require('./routes/breed.routes');
const medicalRecordRoutes = require('./routes/medical_record.routes');
const medicineRoutes = require('./routes/medicine.routes');
const typeRoutes = require('./routes/medicine_type.routes');
const unitRoutes = require('./routes/medicine_unit.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const vaccinationRoutes = require('./routes/vaccination.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const prescriptionItemRoutes = require('./routes/prescription_item.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

db.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err.message);
  });

app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/prescription-items', prescriptionItemRoutes);

app.get('/', (req, res) => {
  res.send('MEOWNWOOF_API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}`);
});
