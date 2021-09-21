import { IllegalProjectDataError, ImportExecuted, ProjectRawDataImported } from '..'
import { AppelOffreRepo } from '../../../dataAccess'
import { User } from '../../../entities'
import { EventBus } from '../../eventStore'
import { parseProjectLine } from '../utils/parseProjectLine'

interface ImportProjectsDeps {
  eventBus: EventBus
  appelOffreRepo: AppelOffreRepo
}

interface ImportProjectsArgs {
  lines: Record<string, string>[]
  importId: string
  importedBy: User
}

export const makeImportProjects =
  ({ eventBus, appelOffreRepo }: ImportProjectsDeps) =>
  async ({ lines, importId, importedBy }: ImportProjectsArgs): Promise<void> => {
    const errors: Record<number, string> = {}
    const projects: any[] = []

    const appelsOffre = await appelOffreRepo.findAll()

    let i = 0
    for (const line of lines) {
      i++
      try {
        const projectData = parseProjectLine(line)

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
            throw new Error(
              `La famille ${familleId} n’existe pas dans l'appel d'offre ${appelOffreId}`
            )
          }
        } else {
          if (appelOffre.familles.length) {
            throw new Error(
              `L'appel d'offre ${appelOffreId} requiert une famille et aucune n'est présente`
            )
          }
        }

        if (!periode.isNotifiedOnPotentiel && !projectData.notifiedOn) {
          throw new Error(
            `La période ${appelOffreId}-${periodeId} est historique (non notifiée sur Potentiel) et requiert donc une date de notification`
          )
        }

        if (periode.isNotifiedOnPotentiel && projectData.notifiedOn) {
          throw new Error(
            `La période ${appelOffreId}-${periodeId} est notifiée sur Potentiel. Le projet concerné ne doit pas comporter de date de notification.`
          )
        }

        projects.push(projectData)
      } catch (e) {
        errors[i] = e.message
        if (Object.keys(errors).length > 100) {
          break
        }
      }
    }

    if (Object.keys(errors).length) {
      throw new IllegalProjectDataError(errors)
    }

    await eventBus.publish(new ImportExecuted({ payload: { importId, importedBy: importedBy.id } }))

    for (const projectData of projects) {
      await eventBus.publish(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: projectData,
          },
        })
      )
    }
  }
