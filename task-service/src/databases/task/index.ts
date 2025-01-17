import path from "path";
import mongoose, { Model } from "mongoose";

// Import classes
import { DirReader } from "src/classes/DirReader";

// Import logger builder
import { LoggerBuilder } from "src/logger";

// Import configs
import AppConfig from "src/app.config.json";
import DatabaseConfig from "src/db.config.json";

// Start log
LoggerBuilder.Logger.info(
  `Starting setup ORM of ${DatabaseConfig.databases[1].name}.`
);

const database = DatabaseConfig.databases[1];

// Get path of endpoints folder
const rootFolder = AppConfig.folders.databases;
const rootPath = path.resolve(`./src/${rootFolder}/${database.name}`);

const reader = new DirReader(AppConfig.unListedEndpointsDir);

const uppercasedDatabaseName = database.name.toUpperCase();
const databaseName = database.database
  ? database.database
  : process.env[`${uppercasedDatabaseName}_NAME`];
const databaseUsername = database.username
  ? database.username
  : process.env[`${uppercasedDatabaseName}_USERNAME`];
const databasePassword = database.password
  ? database.password
  : process.env[`${uppercasedDatabaseName}_PASSWORD`];
const databaseHost = database.host
  ? database.host
  : process.env[`${uppercasedDatabaseName}_HOST`];
const databaseEngine = database.engine
  ? database.engine
  : process.env[`${uppercasedDatabaseName}_ENGINE`];

LoggerBuilder.Logger.info(
  `Setup ORM of ${DatabaseConfig.databases[1].name} done. Database: ${databaseName}; Host: ${databaseHost}; Engine: ${databaseEngine}.`
);
LoggerBuilder.Logger.info(
  `ORM of ${DatabaseConfig.databases[1].name} is ready to used.`
);

export type TaskManagerModelsType = {
  Task: Model<any>;
  Assignment: Model<any>;
  TaskStatus: Model<any>;
  TaskPriority: Model<any>;
  TaskSize: Model<any>;
};

const _models = {};

export default function () {
  const connectionString = `mongodb://${databaseUsername}:${databasePassword}@${databaseHost}:27017/${databaseName}`;

  LoggerBuilder.Logger.info(`Try to connect to database ${databaseName}.`);

  mongoose
    .connect(connectionString, {
      authSource: "admin",
    })
    .catch((error) => {
      LoggerBuilder.Logger.error(error.message);
      process.exit(1);
    });

  if (Object.keys(_models).length === 0) {
    const modelFilePaths = reader.getAllPathsToFilesSync(rootPath);

    for (const modelFilePath of modelFilePaths) {
      const modelDefault = require(modelFilePath);

      if (!modelDefault.default)
        throw new Error("Model should be exported as default.");

      const model = modelDefault.default;

      // Init
      const result = model();
      (_models as any)[result.name] = result.model;
    }
    LoggerBuilder.Logger.info(
      `Build model done. Total of models is ${Object.keys(_models).length}.`
    );
  }

  LoggerBuilder.Logger.info(
    `All ORM Models of ${DatabaseConfig.databases[0].name} are ready to used.`
  );

  return _models as TaskManagerModelsType;
}
