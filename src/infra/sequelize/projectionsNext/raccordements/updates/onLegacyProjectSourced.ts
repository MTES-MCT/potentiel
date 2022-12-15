import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { LegacyProjectSourced } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { Raccordements, RaccordementsProjector } from '../raccordements.model'

export default RaccordementsProjector.on(LegacyProjectSourced, async (évènement, transaction) => {
  const {
    payload: { projectId: projetId },
  } = évènement

  const entréeExistance = await Raccordements.findOne({ where: { projetId }, transaction })

  if (entréeExistance) {
    return
  }

  try {
    await Raccordements.create(
      {
        id: new UniqueEntityID().toString(),
        projetId,
      },
      { transaction }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement LegacyProjectSourced`,
        {
          évènement,
          nomProjection: 'Raccordements',
        },
        error
      )
    )
  }
})
