import { logger } from '@core/utils'
import { AppelOffreProjetModifié } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

export const onAppelOffreProjetModifié = (models) => async (event: AppelOffreProjetModifié) => {
  const { projectId, appelOffreId } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      new ProjectionEnEchec(`Le projet n'existe pas`, {
        nomProjection: 'onAppelOffreProjetModifié',
        evenement: event,
      })
    )
    return
  }

  projectInstance.appelOffreId = appelOffreId

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors de l'enregistrement des modifications sur la projection Project`,
        {
          nomProjection: 'onAppelOffreProjetModifié',
          evenement: event,
        },
        e
      )
    )
  }
}
