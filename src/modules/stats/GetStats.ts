import { StatsDTO } from './StatsDTO'

export type GetStats = () => Promise<StatsDTO | null>
