import { DataTypes, Sequelize } from 'sequelize';
import { GestionnaireRéseau } from './gestionnairesRéseau.model';

export const initializeGestionnaireRéseauModel = (sequelize: Sequelize) => {
  GestionnaireRéseau.init(
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
      tableName: 'gestionnaireRéseau',
      timestamps: false,
      freezeTableName: true,
    },
  );
};
