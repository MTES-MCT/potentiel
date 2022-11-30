import { logger } from '@core/utils'
import { GarantiesFinancièresValidées } from '@modules/project'

export const onGarantiesFinancièresValidées =
  (models) => async (event: GarantiesFinancièresValidées) => {
    const { ProjectStep } = models
    const { projetId, validéesPar } = event.payload
    const instance = await ProjectStep.findOne({
      where: { projectId: projetId, type: 'garantie-financiere' },
    })

    if (!instance) {
      logger.error(
        `Error: onGarantiesFinancièresValidées projection failed to retrieve projectStep from db ${event}`
      )
      return
    }

    const { occurredAt } = event

    Object.assign(instance, {
      status: 'validé',
      statusUpdatedOn: occurredAt,
      statusUpdatedBy: validéesPar,
    })
    try {
      await instance.save()
    } catch (e) {
      logger.error(e)
      logger.info(
        'Error: onGarantiesFinancièresValidées projection failed to update projectStep :',
        event
      )
    }
  }
