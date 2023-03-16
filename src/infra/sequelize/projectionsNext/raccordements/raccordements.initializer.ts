import { DataTypes, Sequelize } from 'sequelize';
import { Raccordements } from './raccordements.model';
import { File } from '../file/file.model';
import { User } from '../users/users.model';
import { GestionnaireRéseau } from '../gestionnairesRéseau/gestionnairesRéseau.model';

export const initializeRaccordementsModel = (sequelize: Sequelize) => {
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
      codeEICGestionnaireRéseau: {
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
      sequelize,
      tableName: 'raccordements',
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

  Raccordements.hasOne(GestionnaireRéseau, {
    foreignKey: 'codeEIC',
    sourceKey: 'codeEICGestionnaireRéseau',
    as: 'gestionnaireRéseau',
  });
};
