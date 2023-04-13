export class AucunDossierRaccordementError extends Error {
  constructor() {
    super(`Le projet n'a aucun dossier de raccordement`);
  }
}
