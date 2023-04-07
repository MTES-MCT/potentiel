import { IWorldOptions, World } from '@cucumber/cucumber';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau/gestionnaireRéseau.world';
import { RaccordementWorld } from './raccordement/raccordement.world';

export class PotentielWorld extends World {
  #gestionnaireRéseauWorld!: GestionnaireRéseauWorld;

  get gestionnaireRéseauWorld() {
    return this.#gestionnaireRéseauWorld;
  }

  #raccordementWorld!: RaccordementWorld;

  get raccordementWorld() {
    return this.#raccordementWorld;
  }

  /**
   *
   */
  constructor(options: IWorldOptions) {
    super(options);

    this.#gestionnaireRéseauWorld = new GestionnaireRéseauWorld();
    this.#raccordementWorld = new RaccordementWorld();
  }
}
