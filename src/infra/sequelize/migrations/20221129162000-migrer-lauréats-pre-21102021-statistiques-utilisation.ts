import { Op, QueryInterface, Sequelize } from 'sequelize'
import { models } from '../models'
import { StatistiquesUtilisation } from '../tableModels'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { Project, EventStore } = models

      const projetsÀAjouter = await Project.findAll(
        {
          where: {
            classe: 'Classé',
            notifiedOn: {
              [Op.and]: {
                [Op.gte]: 1586960864000, // 15/04/2020
                [Op.lte]: 1603238400000, // 21/10/2020
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

      for (const projet of projetsÀAjouter) {
        await StatistiquesUtilisation.create(
          {
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
          },
          {
            transaction,
          }
        )
      }

      await EventStore.destroy(
        {
          where: {
            type: 'ProjectCertificateDownloaded',
          },
          truncate: true,
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
