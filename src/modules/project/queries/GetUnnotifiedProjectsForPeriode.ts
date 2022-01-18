import { ResultAsync } from '@core/utils'
import { AppelOffre, Periode, Project } from '@entities'
import { InfraNotAvailableError } from '../../shared'

export interface UnnotifiedProjectDTO {
  projectId: Project['id']
  familleId: Project['familleId']
  candidateEmail: Project['email']
  candidateName: Project['nomRepresentantLegal']
}

export type GetUnnotifiedProjectsForPeriode = (
  appelOffreId: AppelOffre['id'],
  periodeId: Periode['id']
) => ResultAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>
