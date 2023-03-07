import { DataTypes, Sequelize } from 'sequelize';
import { User } from '../users/users.model';
import { File } from '../file/file.model';
import {
  GarantiesFinancières,
  garantiesFinancièresStatuts,
  garantiesFinancièresTableName,
} from './garantiesFinancières.model';

export const initializeGarantiesFinancièresModel = (sequelize: Sequelize) => {
  GarantiesFinancières.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      projetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM(...garantiesFinancièresStatuts),
        allowNull: false,
      },
      soumisesALaCandidature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      dateLimiteEnvoi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fichierId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dateEnvoi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      envoyéesPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dateConstitution: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateEchéance: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validéesPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      validéesLe: {
        type: DataTypes.DATE,
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
      sequelize,
      tableName: garantiesFinancièresTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};

export const initializeGarantiesFinancièresModelAssociations = () => {
  GarantiesFinancières.hasOne(File, {
    foreignKey: 'id',
    sourceKey: 'fichierId',
    as: 'fichier',
  });

  GarantiesFinancières.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'envoyéesPar',
    as: 'envoyéesParRef',
  });

  GarantiesFinancières.hasOne(User, {
    foreignKey: 'id',
    sourceKey: 'validéesPar',
    as: 'validéesParRef',
  });
};
