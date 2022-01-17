import { ResultAsync } from '@core/utils'
import { InfraNotAvailableError } from '../../shared'
import { AppelOffreDTO } from '../dtos'

export type GetAppelOffreList = () => ResultAsync<AppelOffreDTO[], InfraNotAvailableError>
