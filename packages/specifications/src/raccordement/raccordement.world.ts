import { GestionnaireRéseauReadModel, IdentifiantProjet } from '@potentiel/domain';

export class RaccordementWorld {
  #identifiantProjet!: IdentifiantProjet;

  get identifiantProjet() {
    if (!this.identifiantProjet) {
      throw new Error('identifiantProjet not initialized');
    }
    return this.#identifiantProjet;
  }

  set identifiantProjet(value: IdentifiantProjet) {
    this.identifiantProjet = value;
  }

  #enedis!: GestionnaireRéseauReadModel;

  get enedis() {
    return this.#enedis;
  }

  constructor() {}
}
