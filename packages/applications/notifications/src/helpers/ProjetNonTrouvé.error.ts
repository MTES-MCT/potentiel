export class ProjetNonTrouvéError extends Error {
  constructor() {
    super('Projet non trouvé');
  }
}
