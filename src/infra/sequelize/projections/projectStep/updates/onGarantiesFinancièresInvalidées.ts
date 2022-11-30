import { logger } from '@core/utils'
import { GarantiesFinancièresInvalidées } from '@modules/project'

export const onGarantiesFinancièresInvalidées =
  (models) => async (event: GarantiesFinancièresInvalidées) => {
    const { ProjectStep } = models
    const { projetId, invalidéesPar } = event.payload
    const instance = await ProjectStep.findOne({
      where: { projectId: projetId, type: 'garantie-financiere' },
    })

    if (!instance) {
      logger.error(
        `Error: onGarantiesFinancièresInvalidées projection failed to retrieve projectStep from db ${event}`
      )
      return
    }

    const { occurredAt } = event

    Object.assign(instance, {
      status: 'à traiter',
      statusUpdatedOn: occurredAt,
      statusUpdatedBy: invalidéesPar,
    })
    try {
      await instance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onGarantiesFinancièresInvalidées projection failed to update projectStep :',
        event
      )
    }
  }
