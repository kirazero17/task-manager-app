import { Model } from "sequelize";

// Import types
import type { Sequelize, DataTypes } from "sequelize";

type AssociationType = {
  object: string;
  name: string;
  type: string;
  foreignKey: string;
  through?: string;
};
const associations: Array<AssociationType> = [
  { object: "Role", name: "role", type: "belong", foreignKey: "roleId" },
];

export default function (sequelize: Sequelize, dataTypes: typeof DataTypes) {
  class User extends Model {
    // Define static functions
    static associate(models: any, objects: any) {
      for (const association of associations) {
        const model = models[association.object];

        if (!model) throw new Error(`The ${association.name} doesn't exist`);

        switch (association.type) {
          case "belong": {
            this.belongsTo(model, {
              foreignKey: association.foreignKey,
              as: association.name,
            });
            break;
          }

          case "belong_many": {
            if (!association.through)
              throw new Error(
                "The properties `through` is required in `belong_many`"
              );

            this.belongsToMany(model, {
              through: association.through,
              foreignKey: association.foreignKey,
              as: association.name,
            });
            break;
          }

          case "has_many": {
            this.hasMany(model, {
              foreignKey: association.foreignKey,
              as: association.name,
            });
            break;
          }

          case "has_one": {
            this.hasOne(model, {
              foreignKey: association.foreignKey,
              as: association.name,
            });
            break;
          }

          default:
            throw new Error(`The ${association.type} isn't supported`);
        }
      }
    }
  }

  User.init(
    {
      id: {
        type: dataTypes.UUID,
        primaryKey: true,
      },
      username: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      hashedPassword: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: dataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { sequelize, tableName: "User" }
  );

  return User;
}
