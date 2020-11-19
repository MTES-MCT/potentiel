import { ResultAsync } from 'neverthrow'
import { InfraNotAvailableError } from '../shared'
import { StatsDTO } from './StatsDTO'

export type GetStats = () => ResultAsync<StatsDTO, InfraNotAvailableError>
