// Import classes
import { Endpoints } from "src/classes/Endpoints";

// Import models
import identity from "src/databases/identity";

const rolesEndpoints = new Endpoints("roles");
const IdentityModels = identity();

// Add your handlers here
rolesEndpoints.createHandler("").get(async (req, res) => {
  return IdentityModels.Role.findAll();
});

export default rolesEndpoints;
