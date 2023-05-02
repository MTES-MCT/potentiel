export class ProjetNonRéférencéError extends Error {
  constructor() {
    super(`Le projet n'est pas référencé`);
  }
}
