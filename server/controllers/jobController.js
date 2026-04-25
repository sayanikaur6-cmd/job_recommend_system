const Job = require("../models/job");
const fetchJobsByLocation = require("../services/fetchJobsByLocation");
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
    let allJobs = [];
    let newJobs = [];

    let currentPage = 1;
    let hasMore = true;
    const MAX_PAGES = 10; // 🔥 safety limit (changeable)

    while (hasMore && currentPage <= MAX_PAGES) {
      const response = await axios.get(
        "https://jsearch.p.rapidapi.com/search",
        {
          params: {
            query: query || "developer jobs",
            page: currentPage.toString(),
            num_pages: "1",
            country: "in",
            date_posted: "all"
          },
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": "jsearch.p.rapidapi.com"
          }
        }
      );

      const jobs = response.data.data;

      if (!jobs || jobs.length === 0) {
        hasMore = false;
        break;
      }

      allJobs.push(...jobs);

      // 🔥 DB optimization (no N+1 query)
      const jobIds = jobs.map(job => job.job_id);

      const existingJobs = await Job.find(
        { job_id: { $in: jobIds } },
        { job_id: 1 }
      );

      const existingIds = new Set(existingJobs.map(j => j.job_id));

      for (let job of jobs) {
        if (!existingIds.has(job.job_id)) {
          newJobs.push({
            job_id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            company_logo: job.employer_logo,
            company_website: job.employer_website,
            publisher: job.job_publisher,
            employment_type: job.job_employment_type,
            employment_types: job.job_employment_types,
            apply_link: job.job_apply_link,
            apply_options: job.apply_options,
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
            skills: extractSkills(job.job_description)
          });
        }
      }

      console.log(`📄 Page ${currentPage} fetched`);

      currentPage++;

      // 🔥 rate limit avoid
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 🔥 bulk insert
    if (newJobs.length > 0) {
      await Job.insertMany(newJobs, { ordered: false });
      console.log(`✅ ${newJobs.length} new jobs saved`);
    }

    res.json({
      totalFetched: allJobs.length,
      totalSaved: newJobs.length,
      jobs: allJobs
    });

  } catch (error) {
    console.error("Search Job Error:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
