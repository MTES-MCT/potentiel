import { getProjectAppelOffre } from '@config'
import { logger } from '@core/utils'
import { ProjectImported } from '@modules/project'

export const onProjectImported = (models) => async (event: ProjectImported) => {
  const { Project } = models

  const { projectId, data, potentielIdentifier } = event.payload

  const appelOffre = getProjectAppelOffre({
    appelOffreId: data.appelOffreId,
    periodeId: data.periodeId,
    familleId: data.familleId,
  })

  try {
    await Project.create({
      id: projectId,
      ...data,
      evaluationCarboneDeRéférence: data.evaluationCarbone,
      potentielIdentifier,
      ...(appelOffre?.isSoumisAuxGF && { isSoumisGf: appelOffre.isSoumisAuxGF }),
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectImported projection failed to update project', event)
  }
}
