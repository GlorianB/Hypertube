describe("api", () => {
  it("responds with a 200 success message", (done) => {
    request(app).get("/api/v1").set("Accept", "application/json").expect("Content-Type", /json/).expect(200, done);
  });
});
