import { ResultAsync } from '@core/utils'
import { ProjectAppelOffre, Technologie } from '@entities'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

export type ProjectDataForDemanderDelaiPage = {
  id: string
  numeroCRE: string
  nomProjet: string
  nomCandidat: string
  communeProjet: string
  departementProjet: string
  regionProjet: string
  puissance: number
  puissanceInitiale: number
  unitePuissance: string
  notifiedOn: number
  completionDueOn: number
  appelOffreId: string
  periodeId: string
  familleId: string | undefined
  numeroGestionnaire: string | undefined
  actionnaire: string
  potentielIdentifier: string
  technologie: Technologie
  appelOffre?: ProjectAppelOffre
  newRulesOptIn: boolean
  acceptanceParams?: { delayInMonths: number; dateAchèvementAccordée?: string } & (
    | { delayInMonths: number; dateAchèvementDemandée?: undefined }
    | {
        delayInMonths?: undefined
        dateAchèvementDemandée: string
      }
  )
}

export type GetProjectDataForDemanderDelaiPage = (
  projectId: string
) => ResultAsync<ProjectDataForDemanderDelaiPage, EntityNotFoundError | InfraNotAvailableError>
