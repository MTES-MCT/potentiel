export class GestionnaireNonRéférencéError extends Error {
  constructor() {
    super(`Le gestionnaire de réseau n'est pas référencé`);
  }
}
