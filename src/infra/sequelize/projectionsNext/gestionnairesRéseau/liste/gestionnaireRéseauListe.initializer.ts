import { DataTypes, Sequelize } from 'sequelize';
import {
  GestionnairesRéseauListe,
  gestionnairesRéseauListeTableName,
} from './gestionnairesRéseauListe.model';

export const initializeGestionnaireRéseauListeModel = (sequelize: Sequelize) => {
  GestionnairesRéseauListe.init(
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
    },
    {
      sequelize,
      tableName: gestionnairesRéseauListeTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
