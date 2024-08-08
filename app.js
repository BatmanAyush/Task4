const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const mongoose = require('mongoose');
const Student = require('./views/database.js'); // Import the Student model

const app = express();


// Connect to MongoDB
mongoose.connect('mongodb+srv://asbro3886:HHoXwr7TcNAq1Es9@cluster0.bm7ik.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0')
.then((client)=>{
    console.log('Connected!')
    app.listen(3000,()=>{
   
        console.log('Server is running on port 3000');
    })
})
.catch((err)=>{
    console.error(err)
});

// Middleware to handle JSON responses
app.use(express.json());

// Serve static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for fetching character details
app.get('/api/characters', async (req, res) => {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Routes for fetching spell details
app.get('/api/spells', async (req, res) => {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/spells');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spells' });
  }
});

// Routes for fetching staff details
app.get('/api/characters/staff', async (req, res) => {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters/staff');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff characters' });
  }
});

// Routes for fetching student details
app.get('/api/characters/students', async (req, res) => {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters/students');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student characters' });
  }
});

// POST route for adding a new student
app.post('/api/students', async (req, res) => {
  try {
    const { id, name, gender, house, wizard } = req.body;
    
    // Create a new student instance
    const newStudent = new Student({ id, name, gender, house, wizard });

    // Save the student to the database
    await newStudent.save();

    // Send back the newly created student data
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add new student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;


    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

   
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/student', async (req, res) => {
try {
  const data = await Student.find();
  res.status(200).json(data);
} catch (error) {
  res.status(500).json({ message: error.message });
}
})

app.delete('/api/student/:id',async(req,res)=>{
  try {
    const { id } = req.params;
    const data = await Student.findByIdAndDelete(id);
    if(!data){
      return res.status(404).json({message: 'Student not found'});
    }
    res.status(200).json({message: 'Student deleted successfully'});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
})

