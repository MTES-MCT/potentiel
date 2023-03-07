import { DataTypes, Sequelize } from 'sequelize';
import {
  GestionnaireRéseauDétail,
  gestionnaireRéseauDétailTableName,
} from './gestionnairesRéseauDétail.model';

export const initializeGestionnaireRéseauDétailModel = (sequelize: Sequelize) => {
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
      sequelize,
      tableName: gestionnaireRéseauDétailTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
