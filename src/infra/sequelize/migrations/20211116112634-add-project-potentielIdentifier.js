'use strict';
const crypto = require('crypto')

const makeProjectIdentifier = (project) => {
  const nakedIdentifier =
    project.appelOffreId.replace(/ /g, '') +
    '-P' +
    project.periodeId +
    (project.familleId ? '-F' + project.familleId : '') +
    '-' +
    project.numeroCRE

  return (
    nakedIdentifier +
    '-' +
    crypto.createHash('md5').update(project.id).digest('hex').substring(0, 3).toUpperCase()
  )
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {

      await queryInterface.addColumn('projects', 'potentielIdentifier', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        transaction,
      })

      const projects = await queryInterface.sequelize.query(
        'SELECT * FROM "projects', 
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      )

      for(const project of projects) {
        const potentielIdentifier = makeProjectIdentifier(project)
        await queryInterface.sequelize.query(
          'UPDATE "projects" SET "potentielIdentifier" = ? ', 
          {
            type: queryInterface.sequelize.UPDATE,
            replacements: potentielIdentifier,
            transaction,
          }
        )
      }

      console.log(`Updated potentielIdentifierfor ${projects.length} projects`)
      await transaction.commit()

    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('projects', 'potentielIdentifier')
  }
};
