import { ResultAsync } from '../../../core/utils'
import { AppelOffre, Periode } from '../../../entities'
import { InfraNotAvailableError } from '../../shared'

export type GetProjectIdsForPeriode = (args: {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  familleId?: string
}) => ResultAsync<string[], InfraNotAvailableError>
