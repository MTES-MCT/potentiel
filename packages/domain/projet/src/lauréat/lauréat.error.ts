import { AggregateNotFoundError, InvalidOperationError } from '@potentiel-domain/core';

export class LauréatNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}

export class LauréatNonNotifiéError extends AggregateNotFoundError {
  constructor() {
    super(`Le projet lauréat n'existe pas`);
  }
}

export class LauréatDéjàNotifiéError extends InvalidOperationError {
  constructor() {
    super(`Le projet lauréat est déjà notifié`);
  }
}

export class CahierDesChargesNonModifiéError extends InvalidOperationError {
  constructor() {
    super("Ce cahier des charges est identique à l'actuel");
  }
}

export class CahierDesChargesIndisponibleError extends InvalidOperationError {
  constructor() {
    super("Ce cahier des charges n'est pas disponible pour cette période");
  }
}

export class RetourAuCahierDesChargesInitialImpossibleError extends InvalidOperationError {
  constructor() {
    super('Il est impossible de revenir au cahier de charges en vigueur à la candidature');
  }
}

export class CahierDesChargesEmpêcheModificationError extends InvalidOperationError {
  constructor() {
    super('Impossible de faire un changement pour ce cahier des charges');
  }
}

export class AppelOffreOuPériodeEmpêcheModificationError extends InvalidOperationError {
  constructor() {
    super("Impossible de faire ce type de changement pour cet appel d'offre ou cette période");
  }
}

export class ProjetAbandonnéError extends InvalidOperationError {
  constructor() {
    super('Impossible de faire un changement pour un projet abandonné');
  }
}

export class ProjetAvecDemandeAbandonEnCoursError extends InvalidOperationError {
  constructor() {
    super(
      "Impossible de faire un changement car une demande d'abandon est en cours pour le projet",
    );
  }
}

export class ProjetAchevéError extends InvalidOperationError {
  constructor() {
    super('Impossible de faire un changement pour un projet achevé');
  }
}
