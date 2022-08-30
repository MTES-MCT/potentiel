import { DemandeAbandon } from '../DemandeAbandon'

export class AccorderDemandeAbandonError extends Error {
  constructor(public demandeAbandon: DemandeAbandon, public raison: string) {
    super(raison || `Impossible d'accorder la demande d'abandon`)
  }
}
