import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../../sequelize.config';
import {
  GestionnairesRéseauListe,
  gestionnairesRéseauListeTableName,
} from './gestionnairesRéseauListe.model';

export const initGestionnaireRéseauListe = () => {
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
      sequelize: sequelizeInstance,
      tableName: gestionnairesRéseauListeTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
