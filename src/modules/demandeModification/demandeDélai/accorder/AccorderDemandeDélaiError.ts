import { DemandeDélai } from '../DemandeDélai'

export class AccorderDemandeDélaiError extends Error {
  constructor(public demandeDélai: DemandeDélai, public raison: string) {
    super(`Impossible d'accorder la demande de délai`)
  }
}
