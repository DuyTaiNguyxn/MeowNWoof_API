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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Để phân tích các yêu cầu JSON
app.use(bodyParser.urlencoded({ extended: true })); // Để phân tích các yêu cầu URL-encoded

// Thêm CORS middleware. Rất quan trọng cho ứng dụng Flutter.
// Trong môi trường production, bạn nên cấu hình CORS chặt chẽ hơn
// để chỉ cho phép các origin cụ thể truy cập API của bạn.
app.use(cors());

// Kiểm tra kết nối Database (tùy chọn, nhưng nên có)
db.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err.message);
    // Có thể thoát ứng dụng nếu không kết nối được DB
    // process.exit(1);
  });

app.use('/api/pets', petRoutes); // Đường dẫn gốc cho Pet
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/species', speciesRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// Route cơ bản để kiểm tra server hoạt động
app.get('/', (req, res) => {
  res.send('MEOWNWOOF_API is running!');
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}`);
});
