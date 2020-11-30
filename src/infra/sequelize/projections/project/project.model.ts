import { DataTypes } from 'sequelize'

export const MakeProjectModel = (sequelize) => {
  const Project = sequelize.define(
    'project',
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
      garantiesFinancieresDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresRelanceOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresSubmittedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresDate: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresFile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      garantiesFinancieresFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      garantiesFinancieresSubmittedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dcrDueOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      dcrSubmittedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      dcrDate: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      dcrFile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dcrFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dcrNumeroDossier: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dcrSubmittedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      certificateFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )

  Project.associate = (models) => {
    const FileModel = models.File
    Project.belongsTo(FileModel, {
      foreignKey: 'garantiesFinancieresFileId',
      as: 'garantiesFinancieresFileRef',
    })

    Project.belongsTo(FileModel, {
      foreignKey: 'dcrFileId',
      as: 'dcrFileRef',
    })

    Project.belongsTo(FileModel, {
      foreignKey: 'certificateFileId',
      as: 'certificateFile',
    })
    // Add belongsTo etc. statements here
  }

  return Project
}
