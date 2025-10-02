import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';

import { RecoursWord } from './recours/recours.world';
import { NotifierÉliminéFixture } from './fixtures/notifierÉliminé.fixture';

type ÉliminéFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export class ÉliminéWorld {
  #éliminéFixtures: Map<string, ÉliminéFixture> = new Map();

  /** @deprecated use notifierEliminéFixture */
  get éliminéFixtures() {
    return this.#éliminéFixtures;
  }

  /** @deprecated use notifierEliminéFixture */
  rechercherÉliminéFixture(nom: string): ÉliminéFixture {
    const éliminé = this.#éliminéFixtures.get(nom);

    if (!éliminé) {
      throw new Error(`Aucun projet éliminé correspondant à ${nom} dans les jeux de données`);
    }

    return éliminé;
  }

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
  set identifiantProjet(value: IdentifiantProjet.ValueType) {
    this.#identifiantProjet = value;
  }

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
        puissanceProductionAnnuelle,
        prixReference,
        nomReprésentantLégal,
        sociétéMère,
        actionnariat,
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
      puissanceProductionAnnuelle,
      actionnariat,
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
}
