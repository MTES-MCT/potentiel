import { DemandeDélai } from '../DemandeDélai'

export class ImpossibleDAccorderDemandeDélai extends Error {
  constructor(public demandeDélai: DemandeDélai) {
    super(`Impossible d'accorder la demande de délai`)
  }
}
