// Import classes
import { Endpoints } from "src/classes/Endpoints";

const _rootEndpoints = new Endpoints("");

// Add handler
_rootEndpoints.createHandler("/").get((req, res) => {
  return "Welcome to Identity Service";
});

export default _rootEndpoints;
