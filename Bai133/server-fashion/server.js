const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Fashion = require('./models/Fashion');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/FashionData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để xử lý tệp tải lên và lưu vào thư mục uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Tạo tên tệp độc đáo để tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Lọc tệp - chỉ chấp nhận hình ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận tệp hình ảnh!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn kích thước tệp (5MB)
  }
});

// API endpoint để tải lên hình ảnh và lưu vào thư mục uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có tệp được tải lên' });
    }
    
    // Trả về URL của hình ảnh đã lưu
    const imageUrl = req.file.filename;
    res.status(201).json({ 
      imageUrl: imageUrl,
      message: 'Tải lên thành công' 
    });
  } catch (error) {
    console.error('Lỗi khi tải lên:', error);
    res.status(500).json({ message: error.message });
  }
});

// Cấu hình express.static để phục vụ tệp tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes

// 1. API lấy tất cả Fashion, sắp xếp theo ngày tạo giảm dần
app.get('/api/fashions', async (req, res) => {
  try {
    const fashions = await Fashion.find().sort({ createdAt: -1 });
    res.json(fashions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. API lọc Fashion theo Style
app.get('/api/fashions/style/:style', async (req, res) => {
  try {
    const { style } = req.params;
    const fashions = await Fashion.find({ style }).sort({ createdAt: -1 });
    res.json(fashions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. API lấy một Fashion theo ID
app.get('/api/fashions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fashion = await Fashion.findById(id);
    
    if (!fashion) {
      return res.status(404).json({ message: 'Không tìm thấy Fashion' });
    }
    
    res.json(fashion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. API thêm mới Fashion
app.post('/api/fashions', async (req, res) => {
  try {
    const { title, details, thumbnail, style } = req.body;
    
    const newFashion = new Fashion({
      title,
      details,
      thumbnail,
      style,
      createdAt: new Date()
    });
    
    const savedFashion = await newFashion.save();
    res.status(201).json(savedFashion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. API chỉnh sửa Fashion
app.put('/api/fashions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details, thumbnail, style } = req.body;
    
    const updatedFashion = await Fashion.findByIdAndUpdate(
      id,
      { title, details, thumbnail, style },
      { new: true }
    );
    
    if (!updatedFashion) {
      return res.status(404).json({ message: 'Không tìm thấy Fashion' });
    }
    
    res.json(updatedFashion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 6. API xóa Fashion
app.delete('/api/fashions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFashion = await Fashion.findByIdAndDelete(id);
    
    if (!deletedFashion) {
      return res.status(404).json({ message: 'Không tìm thấy Fashion' });
    }
    
    res.json({ message: 'Xóa Fashion thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes
const fashionRoutes = require('./routes/fashionRoutes');
app.use('/api', fashionRoutes);

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});