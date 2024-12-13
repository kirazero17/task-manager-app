// Import classes
import { Endpoints } from "src/classes/Endpoints";

const authEndpoints = new Endpoints("auth");

// Add your handlers here
authEndpoints.createHandler("").get((req, res) => {
  return "Hello from auth root endpoint";
});

authEndpoints.createHandler("sign-up").post((req, res) => {
  return {
    users: [],
    text: "Hello world"
  };
});

authEndpoints.createHandler("sign-in").post((req, res) => {
  return {
    users: [],
    text: "Hello world"
  };
});

export default authEndpoints;
