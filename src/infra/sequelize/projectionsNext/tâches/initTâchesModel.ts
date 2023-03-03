import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { Tâches, étatsTâche, typesTâche, tâcheTableName } from './tâches.model';

export const initTâchesModel = () => {
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
      sequelize: sequelizeInstance,
      tableName: tâcheTableName,
      timestamps: false,
      freezeTableName: true,
    },
  );
};
