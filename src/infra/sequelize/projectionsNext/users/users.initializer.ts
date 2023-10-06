import { DataTypes, Sequelize } from 'sequelize';
import { User, étatsUser } from './users.model';
import { Project } from '../project/project.model';

export const initializeUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      registeredOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      keycloakId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      fonction: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      état: {
        type: DataTypes.ENUM(...étatsUser),
        allowNull: true,
      },

      createdAt: DataTypes.DATE,
      hash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeUserModelAssociations = () => {
  User.hasMany(Project, { as: 'candidateProjects', foreignKey: 'email', sourceKey: 'email' });
};
