import { ResultAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { PeriodeDTO } from '../dtos'

export type GetPeriodeList = () => ResultAsync<PeriodeDTO[], InfraNotAvailableError>
