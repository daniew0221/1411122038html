const express = require('express');
const multer = require('multer');
const path = require('path');
const NeDB = require('nedb');
const app = express();
const port = 3000;

// 提供靜態文件（包括 index.html）
app.use(express.static(path.join(__dirname, 'public')));

// 設定圖片上傳目錄並限制文件大小和類型
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 限制文件大小為 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// 初始化 NeDB 資料庫
const db = new NeDB({
  filename: 'images.db',
  autoload: true,
});

// 提供靜態文件（圖片）訪問
app.use('/uploads', express.static('uploads'));

// 設定路由：上傳圖片
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  
  const newImage = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
    uploadedAt: new Date(),
  };

  db.insert(newImage, (err, newDoc) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.status(200).send({
      message: 'File uploaded successfully',
      image: newDoc,
    });
  });
});

// 設定路由：顯示已上傳圖片列表
app.get('/images', (req, res) => {
  db.find({}, (err, images) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.status(200).json(images);
  });
});




// 啟動伺服器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
