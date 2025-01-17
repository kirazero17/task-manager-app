// Use Sequelize
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";

// Import classes
import { DirReader } from "src/classes/DirReader";

// Import logger builder
import { LoggerBuilder } from "src/logger";

// Import configs
import AppConfig from "src/app.config.json";
import DatabaseConfig from "src/db.config.json";

// Import types
import type { Model, ModelStatic } from "sequelize";

// Start log
LoggerBuilder.Logger.info(
  `Starting setup ORM of ${DatabaseConfig.databases[0].name}.`
);

// Get specific configuration for database
const database = DatabaseConfig.databases[0];

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
  `Setup ORM of ${DatabaseConfig.databases[0].name} done. Database: ${databaseName}; Host: ${databaseHost}; Engine: ${databaseEngine}.`
);
LoggerBuilder.Logger.info(
  `ORM of ${DatabaseConfig.databases[0].name} is ready to used.`
);

export type IdentityModelsType = {
  User: ModelStatic<Model>;
  Role: ModelStatic<Model>;
};

const _models = {};

export default function () {
  LoggerBuilder.Logger.info(`Try to connect to database ${databaseName}.`);
  const sequelize = new Sequelize(
    databaseName!,
    databaseUsername!,
    databasePassword,
    {
      host: databaseHost,
      dialect: databaseEngine as Dialect,
    }
  );

  sequelize.authenticate().catch((error) => {
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
      const result = model(sequelize, DataTypes);
      (_models as any)[result.name] = result;
    }

    LoggerBuilder.Logger.info(
      `Build model done. Total of models is ${Object.keys(_models).length}.`
    );

    // Use another for loop to check associations
    // Note: `associations` config only exists in SQL
    for (const key in _models) {
      if (
        (_models as any)[key].associate &&
        typeof (_models as any)[key].associate === "function"
      ) {
        (_models as any)[key].associate(_models, database.objects);
      }
    }

    LoggerBuilder.Logger.info("Build model associations done.");
    LoggerBuilder.Logger.info(
      `All ORM Models of ${DatabaseConfig.databases[0].name} are ready to used.`
    );
  }

  return _models as IdentityModelsType;
}
