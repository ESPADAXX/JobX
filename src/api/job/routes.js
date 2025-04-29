const express = require('express');
const router = express.Router();
const jobController = require('./controller');

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get a single job by ID
router.get('/:id', jobController.getJobById);

// get jobs for specific user
router.get('/user/:userId', jobController.getJobsForUser);

// Create a new job
router.post('/', jobController.createJob);

// Update a job
router.put('/:id', jobController.updateJob);

// Delete a job
router.delete('/:id', jobController.deleteJob);

module.exports = router; 