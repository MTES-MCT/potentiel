import { logger } from '@core/utils'
import { AppelOffreProjetModifié } from '@modules/project'
import { ProjectionEnEchec } from '@modules/shared'

export const onAppelOffreProjetModifié = (models) => async (évènement: AppelOffreProjetModifié) => {
  const { projectId, appelOffreId } = évènement.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      new ProjectionEnEchec(`Le projet n'existe pas`, {
        nomProjection: 'onAppelOffreProjetModifié',
        évènement,
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
          évènement,
        },
        e
      )
    )
  }
}
