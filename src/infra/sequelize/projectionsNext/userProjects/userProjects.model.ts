import { makeSequelizeProjector } from '@infra/sequelize/helpers';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { Users } from "..";

class UserProjects extends Model<
  InferAttributes<UserProjects>,
  InferCreationAttributes<UserProjects>
> {
  userId: string;
  projectId: string;
  user: NonAttribute<Users>;
}

const nomProjection = 'UserProjects';

UserProjects.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    freezeTableName: true,
  },
);

UserProjects.belongsTo(Users, { foreignKey: 'userId' });

const UserProjectsProjector = makeSequelizeProjector(UserProjects, nomProjection);

export { UserProjects, UserProjectsProjector };
