import { DataTypes, Sequelize } from 'sequelize';
import { Project } from './project.model';
import { File } from '../file/file.model';
import { UserProjects } from '../userProjects/userProjects.model';

export const initializeProjectModel = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      appelOffreId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      periodeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numeroCRE: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      familleId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomCandidat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nomProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      puissanceInitiale: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      puissance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      prixReference: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      evaluationCarbone: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      evaluationCarboneDeRéférence: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      note: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      nomRepresentantLegal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adresseProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      codePostalProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      communeProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departementProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      territoireProjet: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      regionProjet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fournisseur: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      motifsElimination: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isFinancementParticipatif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isInvestissementParticipatif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      engagementFournitureDePuissanceAlaPointe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      notifiedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      dcrDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      completionDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      abandonedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      certificateFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      cahierDesChargesActuel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'initial',
      },
      potentielIdentifier: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'potId',
      },
      technologie: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionnariat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      désignationCatégorie: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      historiqueAbandon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'projects',
      timestamps: true,
    },
  );
};

export const initializeProjectModelModelAssociations = () => {
  Project.belongsTo(File, {
    foreignKey: 'dcrFileId',
    as: 'dcrFileRef',
  });

  Project.belongsTo(File, {
    foreignKey: 'certificateFileId',
    as: 'certificateFile',
  });

  Project.hasMany(UserProjects, {
    as: 'users',
    foreignKey: 'projectId',
  });
};
