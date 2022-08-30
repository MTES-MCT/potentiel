import { DemandeAbandon } from '../DemandeAbandon'

export class DemanderConfirmationAbandonError extends Error {
  constructor(public demandeAbandon: DemandeAbandon, public raison: string) {
    super(`Impossible de demander une demande de confirmation`)
  }
}
