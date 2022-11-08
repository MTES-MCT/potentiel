import { logger } from '@core/utils'
import { ProjectGFDueDateSet } from '@modules/project'
import { QueryInterface } from 'sequelize'
import { toPersistance } from '../helpers'
import models from '../models'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore, Project } = models
      const projects = await Project.findAll(
        {
          where: { appelOffreId: 'Eolien', periodeId: '6', classe: 'Classé' },
          attributes: ['id', 'garantiesFinancieresDueOn', 'notifiedOn'],
        },
        { transaction }
      )
      if (!projects.length) {
        logger.error(`aucun projet trouvé`)
        return
      }
      console.log(`Nombre de projets lauréats de la période : ${projects.length}`)

      let événementsAjoutés = 0
      let projetNonModifiés = 0

      for (const project of projects) {
        const { id: projectId, garantiesFinancieresDueOn, notifiedOn } = project

        const projectGFDueDateSetEvent = await EventStore.findOne(
          {
            where: { type: 'ProjectGFDueDateSet', 'payload.projectId': projectId },
          },
          { transaction }
        )
        if (projectGFDueDateSetEvent) {
          projetNonModifiés++
          return
        }
        await EventStore.create(
          toPersistance(
            new ProjectGFDueDateSet({
              payload: { projectId, garantiesFinancieresDueOn },
              original: {
                occurredAt: new Date(notifiedOn),
                version: 1,
              },
            })
          ),
          { transaction }
        )
        événementsAjoutés++
      }

      console.log(`Nombre d'événements créés : ${événementsAjoutés}`)
      console.log(`Nombre de projets non modifiés : ${projetNonModifiés}`)

      transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {},
}
