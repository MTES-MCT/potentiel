import { ImportExecuted, ProjectRawDataImported } from '../events'
import { IllegalProjectDataError } from '../errors'
import { parseProjectModifications } from '../utils'
import { AppelOffreRepo } from '@dataAccess'
import { User } from '@entities'
import { parseProjectLine } from '../utils/parseProjectLine'
import { LegacyModificationRawDataImported } from '../../modificationRequest'
import { EventBus } from '@core/domain'

interface ImportProjectsDeps {
  eventBus: EventBus
  appelOffreRepo: AppelOffreRepo
}

interface ImportProjectsArgs {
  lines: Record<string, string>[]
  importId: string
  importedBy: User
}

export const makeImportProjects = ({ eventBus, appelOffreRepo }: ImportProjectsDeps) => async ({
  lines,
  importId,
  importedBy,
}: ImportProjectsArgs): Promise<void> => {
  const errors: Record<number, string> = {}
  const projects: {
    projectData: ReturnType<typeof parseProjectLine>
    legacyModifications: ReturnType<typeof parseProjectModifications>
  }[] = []

  const appelsOffre = await appelOffreRepo.findAll()

  for (const [i, line] of lines.entries()) {
    try {
      const projectData = parseProjectLine(line)

      const { isLegacyProject } = checkAppelOffrePeriode(projectData, appelsOffre)

      const legacyModifications = parseProjectModifications(line)

      const hasLegacyModifications = !!legacyModifications.length
      checkLegacyRules({ projectData, isLegacyProject, hasLegacyModifications })

      projects.push({ projectData, legacyModifications })
    } catch (e) {
      errors[i + 1] = e.message
      if (Object.keys(errors).length > 100) {
        break
      }
    }
  }

  if (Object.keys(errors).length) {
    throw new IllegalProjectDataError(errors)
  }

  await eventBus.publish(new ImportExecuted({ payload: { importId, importedBy: importedBy.id } }))

  for (const { projectData, legacyModifications } of projects) {
    await eventBus.publish(
      new ProjectRawDataImported({
        payload: {
          importId,
          data: projectData,
        },
      })
    )

    const { appelOffreId, periodeId, familleId, numeroCRE } = projectData

    if (legacyModifications.length) {
      await eventBus.publish(
        new LegacyModificationRawDataImported({
          payload: {
            appelOffreId,
            periodeId,
            familleId,
            numeroCRE,
            importId,
            modifications: legacyModifications,
          },
        })
      )
    }
  }
}

const checkAppelOffrePeriode = (projectData, appelsOffre) => {
  const { appelOffreId, periodeId, familleId } = projectData
  const appelOffre = appelsOffre.find((appelOffre) => appelOffre.id === appelOffreId)
  if (!appelOffre) {
    throw new Error(`Appel d’offre inconnu: ${appelOffreId}`)
  }
  // Check the periode
  const periode = appelOffre.periodes.find((periode) => periode.id === periodeId)
  if (!periode) {
    throw new Error(`Période inconnue pour cet appel d'offre ${periodeId}`)
  }

  // Check the famille
  if (familleId) {
    if (!appelOffre.familles.length) {
      throw new Error(
        `L'appel d'offre ${appelOffreId} n'a pas de familles, mais la ligne en comporte une: ${familleId}`
      )
    }

    const famille = appelOffre.familles.find((famille) => famille.id === familleId)
    if (!famille) {
      throw new Error(`La famille ${familleId} n’existe pas dans l'appel d'offre ${appelOffreId}`)
    }
  } else {
    if (appelOffre.familles.length) {
      throw new Error(
        `L'appel d'offre ${appelOffreId} requiert une famille et aucune n'est présente`
      )
    }
  }

  return { isLegacyProject: !periode.isNotifiedOnPotentiel }
}

const checkLegacyRules = (args: {
  projectData
  isLegacyProject: boolean
  hasLegacyModifications: boolean
}) => {
  const { projectData, isLegacyProject, hasLegacyModifications } = args
  const { appelOffreId, periodeId } = projectData

  if (isLegacyProject) {
    if (!projectData.notifiedOn) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est historique (non notifiée sur Potentiel) et requiert donc une date de notification`
      )
    }
  } else {
    if (projectData.notifiedOn) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est notifiée sur Potentiel. Le projet concerné ne doit pas comporter de date de notification.`
      )
    }

    if (hasLegacyModifications) {
      throw new Error(
        `La période ${appelOffreId}-${periodeId} est notifiée sur Potentiel. Le projet concerné ne doit pas comporter de modifications.`
      )
    }
  }
}
