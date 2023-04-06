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

  constructor() {
    this.#enedis = {
      codeEIC: '17X100A100A0001A',
      raisonSociale: 'Enedis',
      type: 'gestionnaire-réseau',
      aideSaisieRéférenceDossierRaccordement: {
        format: '',
        légende: '',
      },
    };
  }
}
