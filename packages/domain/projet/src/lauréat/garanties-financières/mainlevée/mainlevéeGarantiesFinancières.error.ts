import { InvalidOperationError } from '@potentiel-domain/core';

export class ProjetNonAbandonnéError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas en statut abandonné",
    );
  }
}

export class ProjetNonAchevéError extends InvalidOperationError {
  constructor() {
    super(
      "Votre demande de mainlevée de garanties financières est invalide car le projet n'est pas achevé (attestation de conformité non transmise au co-contractant et dans Potentiel)",
    );
  }
}

export class DépôtDeGarantiesFinancièresÀSupprimerError extends InvalidOperationError {
  constructor() {
    super(
      "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation.",
    );
  }
}
