let expect;
let StringUtils;

before(async function () {
  // Dynamically import Chai
  const chai = await import("chai");
  expect = chai.expect;

  // Require StringUtils normally
  StringUtils = require("../utils/string");
});

describe("Test [getPath] method of StringUtils", function () {
  let str;

  beforeEach(function () {
    str = new StringUtils(); // Initialize a new instance before each test
  });

  // Test case 1
  it('Args = ["auth", "user", ":id"] should be /auth/user/:id', function () {
    const result = str.getPath("auth", "user", ":id");
    expect(result).to.equal("/auth/user/:id");
  });

  // Test case 2
  it('Args = ["///users", "//:id", "/something//wrong"] should be /users/:id/something/wrong', function () {
    const result = str.getPath("///users", "//:id", "/something//wrong");
    expect(result).to.equal("/users/:id/something/wrong");
  });
});
