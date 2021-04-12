import { okAsync, ResultAsync } from '../../../core/utils'
import { AppelOffre, Famille } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { PeriodeDTO } from '../dtos'

export type GetPeriode = (
  appelOffreId: string,
  periodeId: string
) => ResultAsync<PeriodeDTO, InfraNotAvailableError | EntityNotFoundError>
