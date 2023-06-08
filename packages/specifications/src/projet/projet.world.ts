import { IdentifiantProjetValueType, convertirEnIdentifiantProjet } from '@potentiel/domain';
import { none } from '@potentiel/monads';

export class ProjetWorld {
  #identifiantProjet: IdentifiantProjetValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  constructor() {
    this.#identifiantProjet = convertirEnIdentifiantProjet({
      appelOffre: 'PPE2 - Eolien',
      période: '1',
      famille: none,
      numéroCRE: '23',
    });
  }
}
