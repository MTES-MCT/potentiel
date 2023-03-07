import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { Raccordements, nomProjection } from './raccordements.model';
import { File } from '../file/file.model';
import { User } from '../users/users.model';

export const initializeRaccordementsModel = () => {
  Raccordements.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      projetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      ptfFichierId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      ptfDateDeSignature: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ptfEnvoyéePar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      identifiantGestionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['projetId'],
        },
      ],
      sequelize: sequelizeInstance,
      tableName: nomProjection,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeRaccordementsModelAssociations = () => {
  Raccordements.hasOne(File, {
    foreignKey: 'id',
    sourceKey: 'ptfFichierId',
    as: 'ptfFichier',
  });

  Raccordements.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'ptfEnvoyéePar',
    as: 'ptfEnvoyéeParRef',
  });
};
