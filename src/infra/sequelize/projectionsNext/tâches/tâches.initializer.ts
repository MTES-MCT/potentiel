import { DataTypes, Sequelize } from 'sequelize';
import { Tâches, étatsTâche, typesTâche, tâcheTableName } from './tâches.model';

export const initializeTâchesModel = (sequelize: Sequelize) => {
  Tâches.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gestionnaire: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      état: {
        type: DataTypes.ENUM(...étatsTâche),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...typesTâche),
        allowNull: false,
      },
      dateDeDébut: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateDeFin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      résultat: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['gestionnaire', 'type', 'dateDeDébut'],
        },
      ],
      sequelize,
      tableName: tâcheTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
