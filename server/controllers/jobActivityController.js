const SavedJob = require("../models/SavedJob");
const Application = require("../models/Application");
const Job = require("../models/job");

const getUserId = (req) =>
  req.user?.id || req.user?._id || req.user?.userId;

exports.saveJob = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { jobId } = req.body;

    const job = await Job.findOne({ job_id: jobId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const saved = await SavedJob.findOneAndUpdate(
      { user: userId, job: job._id },
      { user: userId, job: job._id },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Job saved",
      saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { jobId } = req.params;

    await SavedJob.findOneAndDelete({
      user: userId,
      job: jobId,
    });

    res.json({
      success: true,
      message: "Job removed from saved list",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const userId = getUserId(req);

    const savedJobs = await SavedJob.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs: savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Job ID required",
      });
    }

    let job;

    if (/^[0-9a-fA-F]{24}$/.test(jobId)) {
      job = await Job.findById(jobId);
    } else {
      job = await Job.findOne({ job_id: jobId });
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found in database. Search/save the job first.",
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        user: userId,
        job: job._id,
      },
      {
        user: userId,
        job: job._id,
        status: "applied",
        appliedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    ).populate("job");

    res.json({
      success: true,
      message: "Application tracked successfully",
      application,
    });
  } catch (error) {
    console.log("APPLY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const userId = getUserId(req);

    const applications = await Application.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: id, user: userId },
      { status, notes },
      { new: true }
    ).populate("job");

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};