import { IWorldOptions, World } from '@cucumber/cucumber';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau/gestionnaireRéseau.world';
//import { RaccordementWorld } from './raccordement/raccordement.world';
import { LauréatWorld } from './projet/lauréat/lauréat.world';
import { RaccordementWorld } from './raccordement/raccordement.world';

export class PotentielWorld extends World {
  #gestionnaireRéseauWorld!: GestionnaireRéseauWorld;

  get gestionnaireRéseauWorld() {
    return this.#gestionnaireRéseauWorld;
  }

  #lauréatWorld!: LauréatWorld;

  get lauréatWorld() {
    return this.#lauréatWorld;
  }

  #raccordementWorld!: RaccordementWorld;

  get raccordementWorld() {
    return this.#raccordementWorld;
  }

  #error!: Error;

  get error() {
    if (!this.#error) {
      throw new Error('No error was thrown');
    }
    return this.#error;
  }

  set error(value: Error) {
    this.#error = value;
  }

  constructor(options: IWorldOptions) {
    super(options);

    this.#gestionnaireRéseauWorld = new GestionnaireRéseauWorld();
    this.#lauréatWorld = new LauréatWorld();
    this.#raccordementWorld = new RaccordementWorld();
  }
}
