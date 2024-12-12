// Use to create Model (or Schema -> Model) for ORM.
// Note: This script is suitable for first initialization.

const fs = require("fs");
const path = require("path");

// Import utils
const { getSrcPath, parseArgs, getSupportedORM } = require("./utils");

// Import config
const AppConfig = require("../src/app.config.json");

const srcPath = getSrcPath();
const templatePath = path.resolve(srcPath, "..", AppConfig.folders.templates);
const targetDirPath = path.resolve(srcPath, AppConfig.folders.databases);

const endpointTemplateName = "endpoint.template";

const placeHolders = {
  rootEndpoint: "[ROOT_ENDPOINT_NAME]",
  endpoints: "[ENDPOINTS]",
  endpoint: "[ENDPOINT]",
  method: "[METHOD]",
};
const [n, f, ...args] = process.argv;

const supportedArgs = [
  {
    value: "--root",
    description:
      "Define the root of endpoint and name of folder, you can just create 1 root endpoint!",
    example: "--root=user",
  },
  {
    value: "-r",
    description:
      "Define the root of endpoint and name of folder, you can just create 1 root endpoint!",
    example: "-r user",
  },
  {
    value: "--endpoint",
    description:
      "Define the name of endpoint, separated by ;. It's defined by [method]<name-of-endpoint>.",
    example: "--endpoint=[post]:id;:id",
  },
  {
    value: "-e",
    description:
      "Define the name of endpoint, separated by ;. It's defined by [method]<name-of-endpoint>.",
    example: "-e [post]:id -e :id",
  },
];

const parsedArgs = parseArgs(args, supportedArgs);
