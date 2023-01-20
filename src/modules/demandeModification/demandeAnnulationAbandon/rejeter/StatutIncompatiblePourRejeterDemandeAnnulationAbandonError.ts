import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon'

export class StatutIncompatiblePourRejeterDemandeAnnulationAbandonError extends Error {
  constructor(public demande: DemandeAnnulationAbandon) {
    super(`Seules les demandes avec le statut 'envoyée' peuvent être rejetées.`)
  }
}
