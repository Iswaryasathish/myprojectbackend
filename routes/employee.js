const express = require('express'); 
const router = express.Router();
const Employee = require('../models/Employee');
const upload = require('../middleware/upload');
const cloudinary = require('../configuration/cloudinaryConfig');
const fs = require('fs');

// Add a new employee
router.post('/add', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check for existing employee with the same employeeId
    const existingEmployee = await Employee.findOne({ employeeId: req.body.employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Remove file from local storage
    fs.unlinkSync(req.file.path);
    
    // Create new employee
    const newEmployee = new Employee({
      photo: result.secure_url,
      employeeId: req.body.employeeId,
      name: req.body.name,
      age: req.body.age,
      jobRole: req.body.jobRole,
      mobileNo: req.body.mobileNo,
      email: req.body.email,
      address: req.body.address,
      salary: req.body.salary, // New field
      joiningMonth: req.body.joiningMonth, // New field
      totalPF: 0 // Placeholder, can be calculated later
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Server error:', err);
    res.status(400).json({ message: 'Error uploading employee', error: err.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });
    if (!employee) return res.status(404).send('Employee not found');
    res.status(200).send(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    // Calculate total PF based on the new data
    const pfRate = 0.12; // Assuming PF rate is 12%
    const monthsWorked = new Date().getMonth() + 1 - new Date(req.body.joiningMonth).getMonth();
    const totalPFAmount = monthsWorked > 0 ? (req.body.salary * pfRate) * monthsWorked : 0;

    const updatedData = {
      ...req.body,
      totalPF: totalPFAmount // Include calculated total PF
    };

    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.id },
      updatedData,
      { new: true }
    );
    if (!employee) return res.status(404).send('Employee not found');
    res.status(200).send(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.id });
    if (!employee) return res.status(404).send('Employee not found');
    res.status(200).send('Employee deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get employees by job role
router.get('/role/:role', async (req, res) => {
  try {
    const employees = await Employee.find({ jobRole: req.params.role });
    res.status(200).send(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});





module.exports = router;
