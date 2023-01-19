import { logger } from '@core/utils'
import { AbandonProjetAnnulé } from '@modules/project'

export const onAbandonProjetAnnulé = (models) => async (event: AbandonProjetAnnulé) => {
  const { Project } = models
  const projectInstance = await Project.findByPk(event.payload.projetId)

  if (!projectInstance) {
    logger.error(
      `Error: onAbandonProjetAnnulé projection failed to retrieve project from db': ${event}`
    )
    return
  }

  const {
    occurredAt,
    payload: { dateAchèvement, dateLimiteEnvoiDcr },
  } = event
  Object.assign(projectInstance, {
    abandonedOn: occurredAt.getTime(),
    dcrDueOn: (dateLimiteEnvoiDcr && dateLimiteEnvoiDcr.getTime()) || 0,
    completionDueOn: dateAchèvement.getTime(),
  })

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onAbandonProjetAnnulé projection failed to update project', event)
  }
}
