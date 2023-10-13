import { InvalidOperationError } from '@potentiel-domain/core';

export class GestionnaireRéseauProjetDéjàDéclaréErreur extends InvalidOperationError {
  constructor() {
    super(`Un gestionnaire de réseau a déjà été déclaré pour ce projet`);
  }
}
