export class DossierRaccordementNonRéférencéError extends Error {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}

export class PlusieursGestionnairesRéseauPourUnProjetError extends Error {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau`,
    );
  }
}

export class RéférenceDossierRaccordementDéjàExistantPourLeProjetError extends Error {
  constructor() {
    super(
      `Il impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet`,
    );
  }
}

export class AucunDossierRaccordementCorrespondantError extends Error {
  constructor() {
    super(`Aucun dossier de raccordement ne correspond à la référence`);
  }
}
