import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';

import { RecoursWord } from './recours/recours.world';
import {
  NotifierÉliminé,
  NotifierÉliminéFixture,
  NotifierÉliminéProps,
} from './fixtures/notifierÉliminé.fixture';

export class ÉliminéWorld {
  #éliminéFixtures: Map<string, IdentifiantProjet.ValueType> = new Map();

  #recoursWorld!: RecoursWord;

  get recoursWorld() {
    return this.#recoursWorld;
  }

  get candidatureWorld() {
    return this.potentielWorld.candidatureWorld;
  }

  #notifierEliminéFixture: NotifierÉliminéFixture;
  get notifierEliminéFixture() {
    return this.#notifierEliminéFixture;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  #nomProjet: string;

  get nomProjet() {
    return this.#nomProjet;
  }

  constructor(public readonly potentielWorld: PotentielWorld) {
    this.#recoursWorld = new RecoursWord();
    this.#notifierEliminéFixture = new NotifierÉliminéFixture();
    this.#nomProjet = 'Du boulodrome de Marseille';

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#2##23`);
  }

  mapToExpected() {
    const {
      dépôt: {
        nomProjet,
        emailContact,
        nomCandidat,
        autorisationDUrbanisme,
        localité,
        puissance,
        prixReference,
        nomReprésentantLégal,
        sociétéMère,
        actionnariat,
        evaluationCarboneSimplifiée,
        puissanceDeSite,
      },
      unitéPuissance,
    } = this.potentielWorld.candidatureWorld.mapToExpected();

    const expected: Éliminé.ConsulterÉliminéReadModel = {
      identifiantProjet: this.identifiantProjet,
      emailContact,
      localité,
      nomCandidat,
      unitéPuissance,
      sociétéMère,
      nomReprésentantLégal,
      autorisationDUrbanisme,
      prixReference,
      nomProjet,
      puissance,
      actionnariat,
      evaluationCarboneSimplifiée,
      puissanceDeSite,
      attestationDésignation: this.potentielWorld.éliminéWorld.recoursWorld.accorderRecoursFixture
        .aÉtéCréé
        ? undefined
        : DocumentProjet.convertirEnValueType(
            this.identifiantProjet.formatter(),
            'attestation',
            this.notifierEliminéFixture.notifiéLe,
            'application/pdf',
          ),
      ...this.notifierEliminéFixture.mapToExpected(),
    };

    return expected;
  }

  /**
   * Recherche un projet éliminé dans les fixtures par son nom,
   * uniquement pour les tests qui nécessitent de manipuler plusieurs projets éliminés
   */
  rechercherÉliminéFixture(nom: string): { identifiantProjet: IdentifiantProjet.ValueType } {
    const identifiantProjet = this.#éliminéFixtures.get(nom);

    if (!identifiantProjet) {
      throw new Error(`Aucun projet éliminé correspondant à ${nom} dans les jeux de données`);
    }

    return { identifiantProjet };
  }

  notifier(props: NotifierÉliminéProps): Readonly<NotifierÉliminé> {
    const fixture = this.#notifierEliminéFixture.créer(props);
    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(fixture.identifiantProjet);
    this.#éliminéFixtures.set(
      this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
      this.identifiantProjet,
    );
    return fixture;
  }
}
