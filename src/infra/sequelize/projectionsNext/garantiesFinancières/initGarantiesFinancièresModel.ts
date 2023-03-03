import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import {
  GarantiesFinancières,
  garantiesFinancièresStatuts,
  garantiesFinancièresTableName,
} from './garantiesFinancières.model';

export const initGarantiesFinancièresModel = () => {
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
      sequelize: sequelizeInstance,
      tableName: garantiesFinancièresTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};
