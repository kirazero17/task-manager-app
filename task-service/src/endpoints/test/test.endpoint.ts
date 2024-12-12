// Import classes
import { Endpoints } from "src/classes/Endpoints";

const testEndpoints = new Endpoints("test");

// Add handler
testEndpoints.createHandler("").get((req, res) => {
  return {
    message: "Test endpoint, you can use following methods",
    methods: [
      {
        path: "/test/health",
      },
    ],
  };
});

testEndpoints.createHandler("health").get((req, res) => {
  return "Health ok";
});

export default testEndpoints;
