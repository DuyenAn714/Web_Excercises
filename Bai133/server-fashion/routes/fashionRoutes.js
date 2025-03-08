const express = require('express');
const router = express.Router();
const Fashion = require('../models/Fashion');
const multer = require('multer');
const path = require('path');

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API lấy tất cả fashion, sắp xếp theo ngày tạo giảm dần
router.get('/fashions', async (req, res) => {
  try {
    const fashions = await Fashion.find().sort({ createdAt: -1 });
    res.json(fashions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API lọc fashion theo style
router.get('/fashions/style/:style', async (req, res) => {
  try {
    const fashions = await Fashion.find({ style: req.params.style }).sort({ createdAt: -1 });
    res.json(fashions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API lấy một fashion theo id
router.get('/fashions/:id', async (req, res) => {
  try {
    const fashion = await Fashion.findById(req.params.id);
    if (!fashion) return res.status(404).json({ message: 'Fashion không tồn tại' });
    res.json(fashion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API thêm mới fashion
router.post('/fashions', upload.single('thumbnail'), async (req, res) => {
  const thumbnailPath = req.file ? `http://localhost:4000/uploads/${req.file.filename}` : '';
  
  const fashion = new Fashion({
    title: req.body.title,
    details: req.body.details,
    thumbnail: thumbnailPath,
    style: req.body.style
  });

  try {
    const newFashion = await fashion.save();
    res.status(201).json(newFashion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API chỉnh sửa fashion
router.put('/fashions/:id', upload.single('thumbnail'), async (req, res) => {
  try {
    const fashion = await Fashion.findById(req.params.id);
    if (!fashion) return res.status(404).json({ message: 'Fashion không tồn tại' });

    if (req.body.title) fashion.title = req.body.title;
    if (req.body.details) fashion.details = req.body.details;
    if (req.body.style) fashion.style = req.body.style;
    if (req.file) {
      fashion.thumbnail = `http://localhost:4000/uploads/${req.file.filename}`;
    } else if (req.body.thumbnail) {
      fashion.thumbnail = req.body.thumbnail;
    }

    const updatedFashion = await fashion.save();
    res.json(updatedFashion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API xóa fashion
router.delete('/fashions/:id', async (req, res) => {
  try {
    const fashion = await Fashion.findById(req.params.id);
    if (!fashion) return res.status(404).json({ message: 'Fashion không tồn tại' });
    
    await Fashion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fashion đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;