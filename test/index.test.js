// test.js (or any other test script name)

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Test the server", () => {
  let server; // Declare a variable to store the server instance

  before((done) => {
    // Start the server on localhost:3333
    server = app.listen(3333, () => {
      console.log("Server started on port 3000");
      done();
    });
  });

  after((done) => {
    // Close the server after all tests are executed
    server.close(() => {
      console.log("Server closed");
      done();
    });
  });

  // Close the server after each test (added this part)
  afterEach((done) => {
    server.close(() => {
      done();
    });
  });

  it("should return a 200 response on /", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
});
