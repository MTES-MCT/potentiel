import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('garantiesFinancières', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      projetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      statut: {
        type: DataTypes.ENUM('en attente', 'à traiter', 'validé'),
        allowNull: false,
      },
      soumisALaCandidature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      dateLimiteEnvoi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fichierId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dateEnvoi: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      envoyéPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dateEchéance: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validéPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      validéLe: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    })

    queryInterface.addConstraint('garantiesFinancières', {
      fields: ['projetId'],
      type: 'unique',
      name: 'GF_unique_par-projet',
    })
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('garantiesFinancières', 'GF_unique_par-projet')
    await queryInterface.dropTable('garantiesFinancières')
  },
}
