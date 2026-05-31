const Job = require("../models/job");

const saveJobsToDB = async (jobs = [], userId) => {
  const operations = jobs.map((job) => {
    const jobData = {
      job_id: job.job_id,

      title: job.job_title || job.title || "",
      company: job.employer_name || job.company || "",
      company_logo: job.employer_logo || job.company_logo || "",

      location:
        job.job_city ||
        job.job_state ||
        job.job_country
          ? `${job.job_city || ""} ${job.job_state || ""} ${job.job_country || ""}`.trim()
          : job.location || "Not specified",

      description: job.job_description || job.description || "",

      apply_link:
        job.job_apply_link ||
        job.apply_link ||
        job.apply_options?.[0]?.apply_link ||
        "",

      publisher: job.job_publisher || job.publisher || "",

      employment_type:
        job.job_employment_types ||
        job.employment_type ||
        [],
    };

    return {
      updateOne: {
        filter: { job_id: jobData.job_id },
        update: {
          $set: jobData,
          $addToSet: {
            searchedBy: userId,
          },
        },
        upsert: true,
      },
    };
  });

  if (operations.length > 0) {
    await Job.bulkWrite(operations, { ordered: false });
  }
};

module.exports = saveJobsToDB;