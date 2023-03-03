export class CodeEICNonTrouvéError extends Error {
  constructor() {
    super(`Le gestionnaire de réseau renseigné n'a pas été retrouvé dans Potentiel.`);
  }
}
