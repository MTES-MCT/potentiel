import { DemandeDélai } from '../DemandeDélai'

export class RefuserDemandeDélaiError extends Error {
  constructor(public demandeDélai: DemandeDélai, public raison: string) {
    super(`Impossible de refuser la demande de délai`)
  }
}
