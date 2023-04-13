export class DossierRaccordementNonRéférencéError extends Error {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}
