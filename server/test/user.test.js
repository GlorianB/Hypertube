const request = require("supertest");

const app = require("../src/app");

const User = require("../src/api/models/User");

describe("/api/v1/user", () => {
  jest.setTimeout(30000);

  beforeAll(async (done) => {
    const userData = {
      username: "test",
      email: "test@test.com",
      password: "$2b$10$.iq/2O5169Nj1jQBjc.oGuDaZPUjOAMariWlgjgBbwETBEmBGDKuy",
      firstname: "test",
      lastname: "test",
      language: "fr",
      history: [],
    };
    await User.insertUser(userData);
    done();
  });

  it("GET: returns a list of user with status code 200", (done) => {
    request(app).get("/api/v1/user").set("Accept", "application/json").expect("Content-Type", /json/).expect(200, done);
  });

  afterAll(async (done) => {
    await User.removeUsers();
    done();
  });
});
