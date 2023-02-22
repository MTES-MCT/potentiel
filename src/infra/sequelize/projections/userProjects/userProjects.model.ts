import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { Users } from '../../projectionsNext';

class UserProjects extends Model<
  InferAttributes<UserProjects>,
  InferCreationAttributes<UserProjects>
> {
  userId: string;
  projectId: string;
  user: NonAttribute<Users>;
}

const nomProjection = 'UserProjects';

export const MakeUserProjectsModel = (sequelize) => {
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
      sequelize,
      tableName: nomProjection,
      freezeTableName: true,
    },
  );

  return UserProjects;
};
