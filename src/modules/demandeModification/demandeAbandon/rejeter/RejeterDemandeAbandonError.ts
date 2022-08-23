import { DemandeAbandon } from '../DemandeAbandon'

export class RejeterDemandeAbandonError extends Error {
  constructor(public demandeAbandon: DemandeAbandon, public raison: string) {
    super(`Impossible de rejeter la demande d'abandon`)
  }
}
