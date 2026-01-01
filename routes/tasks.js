
import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Task from '../models/Task.js';

// ALL TASKS
router.get('/', auth, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate('assignedTo', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }); 
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// CREATE TASK
router.post('/', auth, async (req, res) => {
  if(req.user.role !== 'admin') return res.status(403).json({msg: 'Not authorized'});
  
  const { title, description, dueDate, assignedTo } = req.body;
  try {
    const newTask = new Task({ title, description, dueDate, assignedTo });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// UPDATE TASK STATUS FOR DEVELOPER
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Ensure dev owns the task
    if(req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
    }

    task.status = 'completed';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE TASK FOR ADMIN
router.delete('/:id', auth, async (req, res) => {
    if(req.user.role !== 'admin') return res.status(403).json({msg: 'Not authorized'});
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

export default router;