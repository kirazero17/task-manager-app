// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";

// Import logger builder
import { LoggerBuilder } from "src/logger";

const rolesEndpoints = new Endpoints("roles");
const IdentityModels = identity();
const logger = new LoggerBuilder().to("role-endpoints").build();

// Add your handlers here
rolesEndpoints.createHandler("").get(async (req, res) => {
  const profiler = logger.startTimer();

  // Start log
  profiler.logger.info(
    LoggerBuilder.buildEndpointLog("Request to get roles", req)
  );

  const roles = await IdentityModels.Role.findAll();

  // Done
  profiler.done(LoggerBuilder.buildEndpointLog("Get roles successfully", req));
  return roles;
});

export default rolesEndpoints;
