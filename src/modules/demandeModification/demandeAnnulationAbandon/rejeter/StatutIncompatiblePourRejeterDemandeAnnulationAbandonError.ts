import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'

export class StatutIncompatiblePourRejeterDemandeAnnulationAbandonError extends Error {
  constructor(public demande: DemandeAnnulationAbandon) {
    super(`Seule les demandes avec le statut 'envoyée' peuvent être rejetées.`)
  }
}
