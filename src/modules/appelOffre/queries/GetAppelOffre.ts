import { okAsync, ResultAsync } from '@core/utils'
import { AppelOffre, Famille } from '../../../entities'
import { EntityNotFoundError, InfraNotAvailableError } from '../../shared'
import { AppelOffreDTO } from '../dtos'

export type GetAppelOffre = (
  appelOffreId: string
) => ResultAsync<AppelOffreDTO, InfraNotAvailableError | EntityNotFoundError>
