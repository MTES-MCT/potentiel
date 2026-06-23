import { type IWorldOptions, World } from '@cucumber/cucumber';

import { CandidatureWorld } from './candidature/candidature.world.js';
import { GestionnaireRéseauWorld } from './gestionnaireRéseau/gestionnaireRéseau.world.js';
import { NotificationWorld } from './notification/notification.world.js';
import { AccèsWorld } from './projet/accès/accès.world.js';
import { LauréatWorld } from './projet/lauréat/lauréat.world.js';
import { ÉliminéWorld } from './projet/éliminé/éliminé.world.js';
import { PériodeWorld } from './période/période.world.js';
import { TâcheWorld } from './tâche/tâche.world.js';
import { TâchePlanifiéeWorld } from './tâche-planifiée/tâchePlanifiée.world.js';
import { UtilisateurWorld } from './utilisateur/utilisateur.world.js';

export class PotentielWorld extends World {
  #périodeWorld!: PériodeWorld;

  get périodeWorld() {
    return this.#périodeWorld;
  }

  #candidatureWorld!: CandidatureWorld;

  get candidatureWorld() {
    return this.#candidatureWorld;
  }

  #gestionnaireRéseauWorld!: GestionnaireRéseauWorld;

  get gestionnaireRéseauWorld() {
    return this.#gestionnaireRéseauWorld;
  }

  #lauréatWorld!: LauréatWorld;

  get lauréatWorld() {
    return this.#lauréatWorld;
  }

  #éliminéWorld!: ÉliminéWorld;

  get éliminéWorld() {
    return this.#éliminéWorld;
  }

  #tâcheWorld!: TâcheWorld;

  get tâcheWorld() {
    return this.#tâcheWorld;
  }

  #tâchePlanifiéeWorld!: TâchePlanifiéeWorld;

  get tâchePlanifiéeWorld() {
    return this.#tâchePlanifiéeWorld;
  }

  #utilisateurWorld!: UtilisateurWorld;

  get utilisateurWorld() {
    return this.#utilisateurWorld;
  }

  #accèsWorld!: AccèsWorld;

  get accèsWorld() {
    return this.#accèsWorld;
  }

  #notificationWorld!: NotificationWorld;

  get notificationWorld() {
    return this.#notificationWorld;
  }

  #error!: Error;

  get hasError() {
    return !!this.#error;
  }

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

    this.#périodeWorld = new PériodeWorld();
    this.#candidatureWorld = new CandidatureWorld();
    this.#gestionnaireRéseauWorld = new GestionnaireRéseauWorld();
    this.#lauréatWorld = new LauréatWorld(this);
    this.#éliminéWorld = new ÉliminéWorld(this);
    this.#tâcheWorld = new TâcheWorld();
    this.#tâchePlanifiéeWorld = new TâchePlanifiéeWorld();
    this.#accèsWorld = new AccèsWorld();
    this.#utilisateurWorld = new UtilisateurWorld(this);
    this.#notificationWorld = new NotificationWorld();
  }
}
