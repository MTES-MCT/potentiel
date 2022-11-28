import { QueryInterface } from 'sequelize'
import { StatistiquesUtilisation } from '../tableModels'
import { models } from '../models'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { EventStore, Project } = models

      const évènementsÀMigrer = await EventStore.findAll(
        {
          where: {
            type: 'ProjectCertificateDownloaded',
          },
        },
        { transaction }
      )

      for (const entrée of évènementsÀMigrer) {
        const projet = await Project.findOne({
          where: {
            id: entrée.payload.projectId,
          },
          attributes: ['appelOffreId', 'periodeId', 'familleId', 'numeroCRE'],
        })

        if (projet) {
          await StatistiquesUtilisation.create(
            {
              type: 'CertificatTéléchargé',
              date: new Date(entrée.occurredAt),
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
      }

      await transaction.commit()
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },

  async down(queryInterface: QueryInterface) {},
}
