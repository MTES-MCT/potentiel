import { Op, QueryInterface, Sequelize } from 'sequelize'
import { models } from '../models'
import { StatistiquesUtilisation } from '../tableModels'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { Project, EventStore } = models

      const projetsNotifierAvantLeComptageDesTéléchargementsDAttestation = await Project.findAll(
        {
          where: {
            classe: 'Classé',
            notifiedOn: {
              [Op.and]: {
                [Op.gte]: new Date('2020-04-15').getTime(),
                [Op.lte]: new Date('2020-10-21').getTime(),
              },
            },
          },
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('id')), 'id'],
            'appelOffreId',
            'periodeId',
            'familleId',
            'numeroCRE',
            'notifiedOn',
          ],
        },
        { transaction }
      )

      await StatistiquesUtilisation.bulkCreate(
        projetsNotifierAvantLeComptageDesTéléchargementsDAttestation.map((projet) => ({
          type: 'AttestationTéléchargée',
          date: new Date(projet.notifiedOn),
          données: {
            utilisateur: { role: 'porteur-projet' },
            projet: {
              appelOffreId: projet.appelOffreId,
              periodeId: projet.periodeId,
              familleId: projet.familleId,
              numeroCRE: projet.numeroCRE,
            },
          },
        })),
        {
          transaction,
        }
      )

      await EventStore.destroy(
        {
          where: {
            type: 'ProjectCertificateDownloaded',
          },
        },
        { transaction }
      )

      await transaction.commit()
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },

  async down(queryInterface: QueryInterface) {},
}
