import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { DélaiCDC2022Appliqué } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(DélaiCDC2022Appliqué, async (évènement, transaction) => {
  const {
    payload: { projetId, ancienneDateLimiteAchèvement, nouvelleDateLimiteAchèvement },
    occurredAt,
  } = évènement
  try {
    await ProjectEvent.create(
      {
        id: new UniqueEntityID().toString(),
        projectId: projetId,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        type: 'DélaiCDC2022Appliqué',
        payload: { ancienneDateLimiteAchèvement, nouvelleDateLimiteAchèvement },
      },
      { transaction }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement DélaiCDC2022Appliqué (projectEvent.update)`,
        { évènement, nomProjection: `ProjectEvent.onDélaiCDC2022Appliqué` },
        error
      )
    )
  }
})
