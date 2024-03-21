import { NotFoundError } from '@potentiel-domain/core';

export class AucunRecoursEnCours extends NotFoundError {
  constructor() {
    super(`Aucun recours n'est en cours`);
  }
}
