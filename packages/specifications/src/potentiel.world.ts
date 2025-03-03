import { IWorldOptions, World } from '@cucumber/cucumber';

import { GestionnaireRéseauWorld } from './gestionnaireRéseau/gestionnaireRéseau.world';
import { LauréatWorld } from './projet/lauréat/lauréat.world';
import { ÉliminéWorld } from './projet/éliminé/éliminé.world';
import { RaccordementWorld } from './raccordement/raccordement.world';
import { TâcheWorld } from './tâche/tâche.world';
import { UtilisateurWorld } from './utilisateur/utilisateur.world';
import { TâchePlanifiéeWorld } from './tâche-planifiée/tâchePlanifiée.world';
import { NotificationWorld } from './notification/notification.world';
import { CandidatureWorld } from './candidature/candidature.world';
import { PériodeWorld } from './période/période.world';

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

  #eliminéWorld!: ÉliminéWorld;

  get eliminéWorld() {
    return this.#eliminéWorld;
  }

  #raccordementWorld!: RaccordementWorld;

  get raccordementWorld() {
    return this.#raccordementWorld;
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
    this.#lauréatWorld = new LauréatWorld();
    this.#eliminéWorld = new ÉliminéWorld();
    this.#raccordementWorld = new RaccordementWorld();
    this.#tâcheWorld = new TâcheWorld();
    this.#tâchePlanifiéeWorld = new TâchePlanifiéeWorld();
    this.#utilisateurWorld = new UtilisateurWorld();
    this.#notificationWorld = new NotificationWorld();
  }
}
