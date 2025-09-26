import { IdentifiantProjet, Lauréat, StatutProjet } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';

import { AbandonWord } from './abandon/abandon.world';
import { ReprésentantLégalWorld } from './représentant-légal/représentantLégal.world';
import { ActionnaireWorld } from './actionnaire/actionnaire.world';
import { AchèvementWorld } from './achèvement/achèvement.world';
import { ModifierLauréatFixture } from './fixtures/modifierLauréat.fixture';
import { NotifierLauréatFixture } from './fixtures/notifierLauréat.fixture';
import { PuissanceWorld } from './puissance/puissance.world';
import { ChoisirCahierDesChargesFixture } from './fixtures/choisirCahierDesCharges.fixture';
import { ProducteurWorld } from './producteur/producteur.world';
import { FournisseurWorld } from './fournisseur/fournisseur.world';
import { DélaiWorld } from './délai/délai.world';
import { GarantiesFinancièresWorld } from './garantiesFinancières/garantiesFinancières.world';
import { InstallateurWorld } from './installateur/installateur.world';
import { InstallationAvecDispositifDeStockageWorld } from './installation-avec-dispositif-de-stockage/stepDefinitions/installationAvecDispositifDeStockage.world';
import { NatureDeLExploitationWorld } from './nature-de-l-exploitation/natureDeLExploitation.world';

type LauréatFixture = {
  nom: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDésignation: string;
  appelOffre: string;
  période: string;
};

export class LauréatWorld {
  #lauréatFixtures: Map<string, LauréatFixture> = new Map();
  get lauréatFixtures() {
    return this.#lauréatFixtures;
  }

  #notifierLauréatFixture: NotifierLauréatFixture;
  get notifierLauréatFixture() {
    return this.#notifierLauréatFixture;
  }

  #modifierLauréatFixture: ModifierLauréatFixture;
  get modifierLauréatFixture() {
    return this.#modifierLauréatFixture;
  }

  #choisirCahierDesChargesFixture: ChoisirCahierDesChargesFixture;
  get choisirCahierDesChargesFixture() {
    return this.#choisirCahierDesChargesFixture;
  }

  get candidatureWorld() {
    return this.potentielWorld.candidatureWorld;
  }

  /** @deprecated use `identifiantProjet` */
  rechercherLauréatFixture(nom: string): LauréatFixture {
    const lauréat = this.#lauréatFixtures.get(nom);

    if (!lauréat) {
      throw new Error(`Aucun projet lauréat correspondant à ${nom} dans les jeux de données`);
    }

    return lauréat;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
  }

  set identifiantProjet(value: IdentifiantProjet.ValueType) {
    this.#identifiantProjet = value;
  }

  #abandonWorld!: AbandonWord;

  get abandonWorld() {
    return this.#abandonWorld;
  }

  #représentantLégalWorld!: ReprésentantLégalWorld;

  get représentantLégalWorld() {
    return this.#représentantLégalWorld;
  }

  #actionnaireWorld!: ActionnaireWorld;

  get actionnaireWorld() {
    return this.#actionnaireWorld;
  }

  #puissanceWorld!: PuissanceWorld;

  get puissanceWorld() {
    return this.#puissanceWorld;
  }

  #producteurWorld!: ProducteurWorld;

  get producteurWorld() {
    return this.#producteurWorld;
  }

  #installateurWorld!: InstallateurWorld;

  get installateurWorld() {
    return this.#installateurWorld;
  }

  #achèvementWorld!: AchèvementWorld;

  get achèvementWorld() {
    return this.#achèvementWorld;
  }

  #fournisseurWorld!: FournisseurWorld;

  get fournisseurWorld() {
    return this.#fournisseurWorld;
  }

  #délaiWorld!: DélaiWorld;

  get délaiWorld() {
    return this.#délaiWorld;
  }
  #garantiesFinancièresWorld!: GarantiesFinancièresWorld;

  get garantiesFinancièresWorld() {
    return this.#garantiesFinancièresWorld;
  }

  #installationAvecDispositifDeStockageWorld!: InstallationAvecDispositifDeStockageWorld;

  get installationAvecDispositifDeStockageWorld() {
    return this.#installationAvecDispositifDeStockageWorld;
  }

  #natureDeLExploitationWorld!: NatureDeLExploitationWorld;

  get natureDeLExploitationWorld() {
    return this.#natureDeLExploitationWorld;
  }

  constructor(public readonly potentielWorld: PotentielWorld) {
    this.#abandonWorld = new AbandonWord();
    this.#représentantLégalWorld = new ReprésentantLégalWorld();
    this.#actionnaireWorld = new ActionnaireWorld();
    this.#puissanceWorld = new PuissanceWorld();
    this.#producteurWorld = new ProducteurWorld();
    this.#installateurWorld = new InstallateurWorld(this);
    this.#achèvementWorld = new AchèvementWorld();
    this.#fournisseurWorld = new FournisseurWorld();
    this.#délaiWorld = new DélaiWorld();
    this.#garantiesFinancièresWorld = new GarantiesFinancièresWorld(this);
    this.#installationAvecDispositifDeStockageWorld = new InstallationAvecDispositifDeStockageWorld(
      this,
    );
    this.#natureDeLExploitationWorld = new NatureDeLExploitationWorld(this);

    this.#notifierLauréatFixture = new NotifierLauréatFixture();
    this.#modifierLauréatFixture = new ModifierLauréatFixture();
    this.#choisirCahierDesChargesFixture = new ChoisirCahierDesChargesFixture();

    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(`PPE2 - Eolien#1##23`);
  }

  mapToExpected() {
    const {
      dépôt: {
        emailContact,
        nomCandidat,
        prixReference,
        coefficientKChoisi,
        autorisationDUrbanisme,
      },
      technologie,
      unitéPuissance,
    } = this.potentielWorld.candidatureWorld.mapToExpected();

    const expected: Lauréat.ConsulterLauréatReadModel = {
      identifiantProjet: this.identifiantProjet,
      ...this.notifierLauréatFixture.mapToExpected(),
      ...this.modifierLauréatFixture.mapToExpected(),
      emailContact,
      nomCandidat,
      technologie,
      prixReference,
      coefficientKChoisi,
      unitéPuissance,
      statut: this.abandonWorld.accorderAbandonFixture.aÉtéCréé
        ? StatutProjet.abandonné
        : StatutProjet.classé,
      autorisationDUrbanisme,
      attestationDésignation: this.potentielWorld.éliminéWorld.recoursWorld.accorderRecoursFixture
        .aÉtéCréé
        ? undefined
        : DocumentProjet.convertirEnValueType(
            this.identifiantProjet.formatter(),
            'attestation',
            this.notifierLauréatFixture.notifiéLe,
            'application/pdf',
          ),
    };
    return expected;
  }
}
