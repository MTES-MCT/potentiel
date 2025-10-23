import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';

import { AbandonWord } from './abandon/abandon.world';
import { ReprésentantLégalWorld } from './représentant-légal/représentantLégal.world';
import { ActionnaireWorld } from './actionnaire/actionnaire.world';
import { AchèvementWorld } from './achèvement/achèvement.world';
import { ModifierNomProjetFixture } from './fixtures/modifierNomProjet.fixture';
import {
  NotifierLauréat,
  NotifierLauréatFixture,
  NotifierLauréatProps,
} from './fixtures/notifierLauréat.fixture';
import { PuissanceWorld } from './puissance/puissance.world';
import { ChoisirCahierDesChargesFixture } from './fixtures/choisirCahierDesCharges.fixture';
import { ProducteurWorld } from './producteur/producteur.world';
import { FournisseurWorld } from './fournisseur/fournisseur.world';
import { DélaiWorld } from './délai/délai.world';
import { GarantiesFinancièresWorld } from './garantiesFinancières/garantiesFinancières.world';
import { InstallationWorld } from './installation/installation.world';
import { NatureDeLExploitationWorld } from './nature-de-l-exploitation/natureDeLExploitation.world';
import { ModifierSiteDeProductionFixture } from './fixtures/modifierSiteDeProduction.fixture';

export class LauréatWorld {
  #lauréatFixtures: Map<string, IdentifiantProjet.ValueType> = new Map();

  #notifierLauréatFixture: NotifierLauréatFixture;
  get notifierLauréatFixture() {
    return this.#notifierLauréatFixture;
  }

  #modifierSiteDeProductionFixture: ModifierSiteDeProductionFixture;
  get modifierSiteDeProductionFixture() {
    return this.#modifierSiteDeProductionFixture;
  }
  #modifierNomProjetFixture: ModifierNomProjetFixture;
  get modifierNomProjetFixture() {
    return this.#modifierNomProjetFixture;
  }

  #choisirCahierDesChargesFixture: ChoisirCahierDesChargesFixture;
  get choisirCahierDesChargesFixture() {
    return this.#choisirCahierDesChargesFixture;
  }

  get candidatureWorld() {
    return this.potentielWorld.candidatureWorld;
  }

  #identifiantProjet: IdentifiantProjet.ValueType;

  get identifiantProjet() {
    return this.#identifiantProjet;
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

  #installationWorld!: InstallationWorld;

  get installationWorld() {
    return this.#installationWorld;
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
    this.#installationWorld = new InstallationWorld(this);
    this.#achèvementWorld = new AchèvementWorld();
    this.#fournisseurWorld = new FournisseurWorld();
    this.#délaiWorld = new DélaiWorld();
    this.#garantiesFinancièresWorld = new GarantiesFinancièresWorld(this);
    this.#natureDeLExploitationWorld = new NatureDeLExploitationWorld(this);

    this.#notifierLauréatFixture = new NotifierLauréatFixture();
    this.#modifierSiteDeProductionFixture = new ModifierSiteDeProductionFixture();
    this.#modifierNomProjetFixture = new ModifierNomProjetFixture();
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
      ...this.modifierSiteDeProductionFixture.mapToExpected(),
      ...this.modifierNomProjetFixture.mapToExpected(),
      emailContact,
      nomCandidat,
      technologie,
      prixReference,
      coefficientKChoisi,
      unitéPuissance,
      statut: this.abandonWorld.accorderAbandonFixture.aÉtéCréé
        ? Lauréat.StatutLauréat.abandonné
        : this.#achèvementWorld.transmettreOuModifierAttestationConformitéFixture.aÉtéCréé
          ? Lauréat.StatutLauréat.achevé
          : Lauréat.StatutLauréat.actif,
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

  /**
   * Recherche un projet lauréat dans les fixtures par son nom,
   * uniquement pour les tests qui nécessitent de manipuler plusieurs projets lauréats
   */
  rechercherLauréatFixture(nom: string): { identifiantProjet: IdentifiantProjet.ValueType } {
    const identifiantProjet = this.#lauréatFixtures.get(nom);

    if (!identifiantProjet) {
      throw new Error(`Aucun projet lauréat correspondant à ${nom} dans les jeux de données`);
    }

    return { identifiantProjet };
  }

  notifier(props: NotifierLauréatProps): Readonly<NotifierLauréat> {
    const fixture = this.notifierLauréatFixture.créer(props);
    this.#identifiantProjet = IdentifiantProjet.convertirEnValueType(fixture.identifiantProjet);
    this.#lauréatFixtures.set(fixture.nomProjet, this.identifiantProjet);
    return fixture;
  }
}
