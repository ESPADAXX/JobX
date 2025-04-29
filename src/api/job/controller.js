const Job = require('../../models/Job');

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({success:true,message:"Jobs fetched successfully",data:jobs});
  } catch (error) {
    res.status(500).json({success:false,message:"Failed to fetch jobs",error:error.message});
  }
};

// get jobs for specific user
exports.getJobsForUser = async (req, res) => {
  try {
    console.log(req.params.userId);
    const jobs = await Job.find({ clientId: req.params.userId })
    res.status(200).json({success:true,message:"Jobs fetched successfully",data:jobs});
  } catch (error) {
    res.status(500).json({success:false,message:"Failed to fetch jobs",error:error.message});
  }
};


// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    const savedJob = await job.save();
    res.status(201).json({success:true,message:"Job created successfully",data:savedJob});
  } catch (error) {
    res.status(400).json({success:false,message:"Failed to create job",error:error.message});
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId domainId');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 