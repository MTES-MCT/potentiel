import { ProjectPTFRemoved } from '@modules/project'
import { Raccordements, RaccordementsProjector } from '../raccordements.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'

export default RaccordementsProjector.on(ProjectPTFRemoved, async (évènement, transaction) => {
  const {
    payload: { projectId },
  } = évènement

  try {
    await Raccordements.update(
      { ptfDateDeSignature: null, ptfEnvoyéePar: null, ptfFichierId: null },
      { where: { projetId: projectId }, transaction }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectPTFRemoved`,
        {
          évènement,
          nomProjection: 'Raccordements',
        },
        error
      )
    )
  }
})
