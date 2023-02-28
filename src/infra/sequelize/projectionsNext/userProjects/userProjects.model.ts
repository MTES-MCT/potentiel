import { makeSequelizeProjector } from '../../helpers';
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { User } from '../users';

class UserProjects extends Model<
  InferAttributes<UserProjects>,
  InferCreationAttributes<UserProjects>
> {
  userId: string;
  projectId: string;
  user: NonAttribute<User>;
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

UserProjects.belongsTo(User, { as: 'user', foreignKey: 'userId' });

const UserProjectsProjector = makeSequelizeProjector(UserProjects, nomProjection);

export { UserProjects, UserProjectsProjector };
