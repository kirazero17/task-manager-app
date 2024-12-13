// Use Sequelize
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";

// Import classes
import { DirReader } from "src/classes/DirReader";

// Import configs
import AppConfig from "src/app.config.json";
import DatabaseConfig from "src/db.config.json";

// Import types
import type { Model, ModelStatic } from "sequelize";

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

export type IdentityModelsType = {
  User: ModelStatic<Model>;
  Role: ModelStatic<Model>;
};

export default function () {
  const models = {};

  const sequelize = new Sequelize(
    databaseName!,
    databaseUsername!,
    databasePassword,
    {
      host: databaseHost,
      dialect: databaseEngine as Dialect,
    }
  );
  const modelFilePaths = reader.getAllPathsToFilesSync(rootPath);

  for (const modelFilePath of modelFilePaths) {
    const modelDefault = require(modelFilePath);

    if (!modelDefault.default)
      throw new Error("Model should be exported as default.");

    const model = modelDefault.default;

    // Init
    const result = model(sequelize, DataTypes);
    (models as any)[result.name] = result;
  }

  // Use another for loop to check associations
  // Note: `associations` config only exists in SQL
  for (const key in models) {
    if (
      (models as any)[key].associate &&
      typeof (models as any)[key].associate === "function"
    ) {
      (models as any)[key].associate(models, database.objects);
    }
  }

  return models as IdentityModelsType;
}
