import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('raccordements', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    queryInterface.addConstraint('raccordements', {
      fields: ['projetId'],
      type: 'unique',
      name: 'raccordement_unique_par-projet',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('raccordements', 'raccordement_unique_par');
    await queryInterface.dropTable('raccordements');
  },
};
