import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'

export class RejeterDemandeAnnulationAbandonError extends Error {
  constructor(public demande: DemandeAnnulationAbandon, public raison: string) {
    super(`Impossible de rejeter la demande d'annulation d'abandon`)
  }
}
