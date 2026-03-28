require("dotenv").config();

const request = require("supertest");
jest.setTimeout(20000);
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const jobs = [
        { title: "Backend Developer", company: "TechNova", location: "Kolkata", skills: ["nodejs", "mongodb"], salary: "6 LPA" },
        { title: "Frontend Developer", company: "CodeCraft", location: "Delhi", skills: ["react", "javascript"], salary: "7 LPA" },
        { title: "Full Stack Developer", company: "DevHub", location: "Bangalore", skills: ["nodejs", "react"], salary: "8 LPA" },
        { title: "Software Engineer", company: "Infosys", location: "Hyderabad", skills: ["java", "spring"], salary: "5 LPA" },
        { title: "MERN Stack Developer", company: "StartupX", location: "Pune", skills: ["mongodb", "express", "react", "nodejs"], salary: "9 LPA" },
        { title: "React Developer", company: "PixelSoft", location: "Chennai", skills: ["react", "redux"], salary: "6 LPA" },
        { title: "Node.js Developer", company: "CloudNet", location: "Noida", skills: ["nodejs", "api"], salary: "7 LPA" },
        { title: "Backend Engineer", company: "TCS", location: "Mumbai", skills: ["nodejs", "sql"], salary: "6.5 LPA" },
        { title: "Frontend Engineer", company: "Wipro", location: "Gurgaon", skills: ["html", "css", "javascript"], salary: "5.5 LPA" },
        { title: "Junior Developer", company: "TechMahindra", location: "Kolkata", skills: ["javascript"], salary: "4 LPA" }
    ];

 let jobId = '69a42e428d8a56048086208b';
beforeAll(async () => {
  await connectDB();
//   await mongoose.connection.collection("jobs").deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Job API Test", () => {
 /* it("should create a job", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({
        title: "Test Developer",
        company: "Test Company",
        location: "Kolkata",
        skills: ["nodejs"],
        salary: "6 LPA"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Test Developer");
  });*/
//  it("should create multiple jobs", async () => {
//   const responses = await Promise.all(
//     jobs.map(job => request(app).post("/api/jobs").send(job))
//   );

//   responses.forEach((res, index) => {
//     expect(res.statusCode).toBe(200);
//     expect(res.body.title).toBe(jobs[index].title);
//   });
// });
it("should update a job", async () => {
  const res = await request(app)
    .put(`/api/jobs/${jobId}`)
    .send({
      salary: "10 LPA",
      location: "Bangalore"
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.salary).toBe("10 LPA");
  expect(res.body.location).toBe("Bangalore");
});
});
