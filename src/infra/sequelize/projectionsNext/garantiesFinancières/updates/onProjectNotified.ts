import { getProjectAppelOffre } from '@config/queries.config'
import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectNotified } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'

export default GarantiesFinancièresProjector.on(ProjectNotified, async (évènement, transaction) => {
  const {
    payload: { projectId: projetId, appelOffreId, periodeId, familleId },
  } = évènement

  const appelOffre = getProjectAppelOffre({ appelOffreId, periodeId, familleId })

  if (!appelOffre) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectNotified: AO non trouvé`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        }
      )
    )
    return
  }

  if (!appelOffre.isSoumisAuxGF) {
    return
  }

  const soumisALaCandidature =
    appelOffre.famille?.soumisAuxGarantiesFinancieres === 'à la candidature' ||
    appelOffre.soumisAuxGarantiesFinancieres === 'à la candidature'

  await GarantiesFinancières.destroy({
    where: { projetId },
    transaction,
  })

  try {
    await GarantiesFinancières.create(
      {
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'du',
        soumisALaCandidature,
      },
      { transaction }
    )
  } catch (error) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'évènement ProjectNotified`,
        {
          évènement,
          nomProjection: 'GarantiesFinancières',
        },
        error
      )
    )
  }
})
