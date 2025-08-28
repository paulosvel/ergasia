const express = require('express');
const multer = require('multer');
const Project = require('../models/Project');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Add new project
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      departments,
      type,
      description,
      partners,
      responsible,
      email,
      year,
      status,
      location
    } = req.body;

    const project = new Project({
      title,
      departments,
      type,
      description,
      partners,
      responsiblePerson: responsible,
      responsibleEmail: email,
      year,
      status,
      location,
      image: req.file ? req.file.filename : null
    });

    await project.save();
    console.log('✅ Project created:', project);
    res.status(201).json({ message: 'Project created successfully!' });
  } catch (err) {
    console.error('❌ Project creation failed:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;
