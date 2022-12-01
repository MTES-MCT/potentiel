import { getProjectAppelOffre } from '@config/queryProjectAO.config'
import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectNotified } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancières, GarantiesFinancièresProjector } from '../garantiesFinancières.model'
import { models } from '../../../models'

export default GarantiesFinancièresProjector.on(ProjectNotified, async (évènement, transaction) => {
  const {
    payload: { projectId: projetId, appelOffreId, periodeId, familleId },
  } = évènement

  const entréeExistance = await GarantiesFinancières.findOne({ where: { projetId }, transaction })

  if (entréeExistance) {
    return
  }

  const { Project } = models

  const projet = await Project.findOne({ where: { id: projetId }, transaction })

  if (projet.classe === 'Eliminé') {
    return
  }

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

  const soumisesALaCandidature =
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
        statut: 'en attente',
        soumisesALaCandidature,
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
