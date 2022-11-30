import { GarantiesFinancièresInvalidées, GarantiesFinancièresValidées } from '@modules/project'
import { QueryInterface } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore, ProjectStep } = models

      const evenementsAMigrer = await EventStore.findAll(
        {
          where: {
            type: 'ProjectStepStatusUpdated',
          },
        },
        { transaction }
      )
      console.log(`${evenementsAMigrer.length} événements ProjectStepStatusUpdated`)

      const nouveauxÉvénements = (
        await Promise.all(
          evenementsAMigrer.map(async (evenement) => {
            const {
              occurredAt,
              payload: { projectStepId, newStatus, statusUpdatedBy },
            } = evenement

            const projectStep = await ProjectStep.findByPk(projectStepId)

            if (projectStep.type !== 'garantie-financiere') return

            const { projectId } = projectStep

            if (newStatus === 'validé') {
              return new GarantiesFinancièresValidées({
                payload: {
                  projetId: projectId,
                  validéesPar: statusUpdatedBy,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            } else {
              return new GarantiesFinancièresInvalidées({
                payload: {
                  projetId: projectId,
                  invalidéesPar: statusUpdatedBy,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((item): item is Exclude<typeof item, undefined> => !!item)

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ${GarantiesFinancièresInvalidées.type} ou ${GarantiesFinancièresValidées.type} vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {},
}
