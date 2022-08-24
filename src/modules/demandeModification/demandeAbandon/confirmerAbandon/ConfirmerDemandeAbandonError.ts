import { DemandeAbandon } from '../DemandeAbandon'

export class ConfirmerDemandeAbandonError extends Error {
  constructor(public demandeAbandon: DemandeAbandon, public raison: string) {
    super(raison)
  }
}
