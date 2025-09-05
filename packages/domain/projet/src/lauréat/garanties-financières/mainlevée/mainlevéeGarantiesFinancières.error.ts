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

export class MainlevéeNonTrouvéeError extends InvalidOperationError {
  constructor() {
    super(`Il n'y a pas de demande de mainlevée de garanties financières en cours pour ce projet`);
  }
}

export class MainlevéeDéjàDemandéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée en cours pour ce projet`);
  }
}

export class MainlevéeDéjàEnInstructionError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée en instruction pour ce projet`);
  }
}

export class MainlevéeDéjàAccordéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée accordée pour ce projet`);
  }
}

export class MainlevéeDéjàRejetéeError extends InvalidOperationError {
  constructor() {
    super(`Il y a déjà une demande de mainlevée rejetée pour ce projet`);
  }
}

export class DernièreDemandeMainlevéeRejetéeEtAucuneEnCours extends InvalidOperationError {
  constructor() {
    super(`La dernière demande de mainlevée pour ce projet a été rejetée, aucune n'est en cours`);
  }
}
