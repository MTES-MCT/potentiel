import { DemandeDélai } from '../DemandeDélai'

export class RejeterDemandeDélaiError extends Error {
  constructor(public demandeDélai: DemandeDélai, public raison: string) {
    super(`Impossible de rejeter la demande de délai`)
  }
}
