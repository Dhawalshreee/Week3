const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../server");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/pace_test";

beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

describe("Signup Endpoint Tests", () => {
    const newUser = {
        name: "Sample User",
        username: "sampleuser",
        email: "sampleuser@example.com",
        password: "Password123",
    };

    it("Created  new user successfully", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send(newUser)
            .set("Accept", "application/json");

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", newUser.name);
        expect(response.body).toHaveProperty("username", newUser.username);
        expect(response.body).toHaveProperty("email", newUser.email);
    });

    it("Do not allow duplicate email registration", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send(newUser);

        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty("error");
    });

    it("fail if required fields are missing", async () => {
        const response = await request(app)
            .post("/api/auth/signup")
            .send({ email: "incomplete@example.com" });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
