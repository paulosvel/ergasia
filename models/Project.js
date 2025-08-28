const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  departments: { type: String },
  type: { type: String },
  description: { type: String },
  partners: { type: String },
  responsiblePerson: { type: String },
  responsibleEmail: { type: String },
  year: { type: String },
  status: { type: String },
  location: { type: String },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
