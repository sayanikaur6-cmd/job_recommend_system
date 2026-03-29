require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const connectDB = require("../config/db");
const bcrypt = require("bcryptjs");

let testUserId; // auto-increment user_id

beforeAll(async () => {
  await connectDB();

  // Optional: clear users collection before test
  await mongoose.connection.collection("users").deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User API Test", () => {

  // ======================
  // CREATE USER
  // ======================
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Shubhadeep Das",
        email: "shubha@test.com",
        password: "123456",
        role: "user"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.name).toBe("Shubhadeep Das");
    testUserId = res.body.user.user_id; // save user_id for later tests
  });

  // ======================
  // GET ALL USERS
  // ======================
  it("should fetch all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ======================
  // GET SINGLE USER
  // ======================
  it("should fetch single user by user_id", async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user_id).toBe(testUserId);
  });

  // ======================
  // UPDATE USER
  // ======================
  it("should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({
        name: "Shubhadeep Updated",
        password: "newpassword"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("Shubhadeep Updated");
  });

  // ======================
  // DELETE USER
  // ======================
  it("should delete a user", async () => {
    const res = await request(app).delete(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.user_id).toBe(testUserId);
  });
});