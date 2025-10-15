import { InvalidOperationError } from '@potentiel-domain/core';

export class DemandeDeChangementInexistanteError extends InvalidOperationError {
  constructor() {
    super("Aucune demande de changement de puissance n'est en cours");
  }
}

export class RéponseSignéeObligatoireSiAccordSansDécisionDeLEtatError extends InvalidOperationError {
  constructor() {
    super("La réponse signée est obligatoire si l'accord n'est pas une décision de l'État");
  }
}
