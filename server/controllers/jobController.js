const Job = require("../models/job");
const fetchJobsByLocation = require("../services/fetchJobsByLocation");
const saveJobsToDB = require("../utils/saveJobsToDB");
const axios = require("axios");
// CREATE
exports.createJob = async (req, res) => {
  const job = await Job.create(req.body);
  res.json(job);
};

// READ ALL
exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

// UPDATE
exports.updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(job);
};

// DELETE
exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
};
exports.getJobloc = async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({ message: "State is required" });
    }

    const jobs = await fetchJobsByLocation(state);

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// 🔥 simple skill extractor
const extractSkills = (desc = "") => {
  const skillsList = ["Node JS", "React", "MongoDB", "Python", "Java"];
  return skillsList.filter(skill =>
    desc.toLowerCase().includes(skill.toLowerCase())
  );
};

exports.searchJobs = async (req, res) => {
  const { query } = req.query;

  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    let allJobs = [];
    let newJobs = [];

    let currentPage = 1;
    let hasMore = true;
    const MAX_PAGES = 1;

    while (hasMore && currentPage <= MAX_PAGES) {
      const response = await axios.get(
        "https://jsearch.p.rapidapi.com/search",
        {
          params: {
            query: query || "developer jobs",
            page: currentPage.toString(),
            num_pages: "1",
            country: "in",
            date_posted: "all",
          },
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
          },
        }
      );

      const jobs = response.data.data || [];

      if (!jobs.length) {
        hasMore = false;
        break;
      }

      allJobs.push(...jobs);

      const jobIds = jobs
        .map((job) => job.job_id)
        .filter(Boolean);

      const existingJobs = await Job.find(
        { job_id: { $in: jobIds } },
        { job_id: 1 }
      );

      const existingIds = new Set(
        existingJobs.map((job) => job.job_id)
      );

      for (let job of jobs) {
        const jobData = {
          job_id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          company_logo: job.employer_logo,
          company_website: job.employer_website,
          publisher: job.job_publisher,

          employment_type: job.job_employment_type,
          employment_types: job.job_employment_types || [],

          apply_link:
            job.job_apply_link ||
            job.apply_options?.[0]?.apply_link ||
            "",

          apply_options: job.apply_options || [],
          description: job.job_description,
          is_remote: job.job_is_remote,

          posted_at: job.job_posted_at,
          posted_timestamp: job.job_posted_at_timestamp,
          posted_date: job.job_posted_at_datetime_utc,

          location: job.job_location,
          city: job.job_city,
          state: job.job_state,
          country: job.job_country,
          latitude: job.job_latitude,
          longitude: job.job_longitude,

          salary: job.job_salary_string,
          min_salary: job.job_min_salary,
          max_salary: job.job_max_salary,
          salary_period: job.job_salary_period,

          benefits: job.job_benefits_strings || [],
          highlights: job.job_highlights,

          source: "jsearch",
        };

        if (!existingIds.has(job.job_id)) {
          if (userId) {
            jobData.searchedBy = [userId];
          }

          newJobs.push(jobData);
        } else if (userId) {
          await Job.updateOne(
            { job_id: job.job_id },
            {
              $addToSet: {
                searchedBy: userId,
              },
            }
          );
        }
      }

      console.log(`📄 Page ${currentPage} fetched`);

      currentPage++;

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (newJobs.length > 0) {
      await Job.insertMany(newJobs, { ordered: false });
      console.log(`✅ ${newJobs.length} new jobs saved`);
    }

    res.json({
      success: true,
      totalFetched: allJobs.length,
      totalSaved: newJobs.length,
      jobs: allJobs,
    });
  } catch (error) {
    console.error(
      "Search Job Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
<<<<<<< HEAD
};
exports.applyJob = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { jobId } = req.body;

    const job = await Job.findOne({
      $or: [{ _id: jobId }, { job_id: jobId }],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const application = await Application.findOneAndUpdate(
      { user: userId, job: job._id },
      {
        user: userId,
        job: job._id,
        status: "applied",
        appliedAt: new Date(),
      },
      { upsert: true, new: true }
    ).populate("job");

    res.json({
      success: true,
      message: "Application tracked successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
=======
>>>>>>> d9d520b9774473c5e34b73bd5707b7b8f90cdf59
};