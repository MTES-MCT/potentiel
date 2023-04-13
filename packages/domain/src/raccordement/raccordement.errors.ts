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
