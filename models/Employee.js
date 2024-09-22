const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  photo: String,
  employeeId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  jobRole: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  joiningMonth: { type: Date, required: true }, // Ensure this is a required field
  salary: { type: Number, required: true }, // Ensure this is a required field
  totalPF: { type: Number, default: 0 } // Default to 0, calculated later
});

module.exports = mongoose.model('Employee', employeeSchema);











