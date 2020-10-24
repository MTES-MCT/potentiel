'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('credentials', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      hash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      appelOffreId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      periodeId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      numeroCRE: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      familleId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      nomCandidat: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      nomProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      puissance: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      prixReference: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      evaluationCarbone: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      note: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      nomRepresentantLegal: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      adresseProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      codePostalProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      communeProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      departementProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      territoireProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      regionProjet: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      classe: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      fournisseur: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      actionnaire: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      motifsElimination: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      isFinancementParticipatif: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      isInvestissementParticipatif: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      engagementFournitureDePuissanceAlaPointe: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },
      notifiedOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresDueOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresRelanceOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresSubmittedOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresDate: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      garantiesFinancieresFile: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      garantiesFinancieresSubmittedBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      dcrDueOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      dcrSubmittedOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      dcrDate: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      dcrFile: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      dcrNumeroDossier: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      dcrSubmittedBy: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      details: {
        type: Sequelize.DataTypes.JSON,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('projectAdmissionKeys', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      appelOffreId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      periodeId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      dreal: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      lastUsedAt: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      fullName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      projectAdmissionKey: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('userDreals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      dreal: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('passwordRetrievals', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      context: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      variables: {
        type: Sequelize.DataTypes.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      error: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('projectEvents', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      before: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      after: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      modificationRequestId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('UserProjects', {
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
    await queryInterface.createTable('modificationRequests', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      requestedOn: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      justification: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      actionnaire: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      producteur: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      fournisseur: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      puissance: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
      },
      evaluationCarbone: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
      },
      delayedServiceDate: {
        type: Sequelize.DataTypes.NUMBER,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
