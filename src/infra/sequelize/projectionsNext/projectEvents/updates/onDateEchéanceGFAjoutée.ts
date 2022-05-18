import { DateEchéanceGFAjoutée } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'
import { Op } from 'sequelize'
import { logger } from '@core/utils'

export default ProjectEvent.projector.on(
  DateEchéanceGFAjoutée,
  async ({ payload: { expirationDate, projectId } }, transaction) => {
    const events = await ProjectEvent.findAll({
      where: { type: { [Op.or]: ['ProjectGFSubmitted', 'ProjectGFUploaded'] }, projectId },
      order: [['eventPublishedAt', 'ASC']],
    })

    const instance = events.pop()

    if (!instance) {
      logger.error(
        `Error : la date d'expiration n'a pas pu être enregistrée, impossible de trouver l'événement garantie financière envoyée/enregistrée pour le project ${projectId})`
      )
      return
    }
    const file = instance.get().payload.file

    Object.assign(instance, { payload: { file, expirationDate: expirationDate.getTime() } })

    try {
      await instance.save({ transaction })
    } catch (e) {
      logger.error(e)
      logger.info('Error: onProjectGFInvalidated projection failed to update project step')
    }
  }
)
