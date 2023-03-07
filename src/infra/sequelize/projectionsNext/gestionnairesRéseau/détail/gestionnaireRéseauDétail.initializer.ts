import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../../sequelize.config';
import {
  GestionnaireRéseauDétail,
  gestionnaireRéseauDétailTableName,
} from './gestionnairesRéseauDétail.model';

export const initializeGestionnaireRéseauDétailModel = () => {
  GestionnaireRéseauDétail.init(
    {
      codeEIC: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      raisonSociale: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      légende: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: gestionnaireRéseauDétailTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
