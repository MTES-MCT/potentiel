import { QueryInterface, DataTypes } from 'sequelize';

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
      soumisesALaCandidature: {
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
      envoyéesPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      dateConstitution: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateEchéance: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validéesPar: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      validéesLe: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    queryInterface.addConstraint('garantiesFinancières', {
      fields: ['projetId'],
      type: 'unique',
      name: 'GF_unique_par-projet',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('garantiesFinancières', 'GF_unique_par-projet');
    await queryInterface.dropTable('garantiesFinancières');
  },
};
