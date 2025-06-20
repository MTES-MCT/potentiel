import { match } from 'ts-pattern';

import {
  AbstractAggregate,
  AggregateType,
  LoadAggregateV2,
  mapToPlainObject,
} from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';
import { Candidature } from '..';

import { LauréatEvent } from './lauréat.event';
import {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
import { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
import { ModifierLauréatOptions } from './modifier/modifierLauréat.option';
import {
  CahierDesChargesEmpêcheModificationError,
  CahierDesChargesIndisponibleError,
  CahierDesChargesNonModifiéError,
  LauréatDéjàNotifiéError,
  LauréatNonTrouvéError,
  ProjetAbandonnéError,
  ProjetAchevéError,
  ProjetAvecDemandeAbandonEnCoursError,
  RetourAuCahierDesChargesInitialImpossibleError,
} from './lauréat.error';
import { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';
import { ChoisirCahierDesChargesOptions } from './cahierDesCharges/choisir/choisirCahierDesCharges.option';
import { AbandonAggregate } from './abandon/abandon.aggregate';
import { AchèvementAggregate } from './achèvement/achèvement.aggregate';
import { ProducteurAggregate } from './producteur/producteur.aggregate';
import { GarantiesFinancièresAggregate } from './garanties-financières/garantiesFinancières.aggregate';
import { PuissanceAggregate } from './puissance/puissance.aggregate';
import { FournisseurAggregate } from './fournisseur/fournisseur.aggregate';
import { ActionnaireAggregate } from './actionnaire/actionnaire.aggregate';

export class LauréatAggregate extends AbstractAggregate<LauréatEvent> {
  #projet!: ProjetAggregateRoot;
  #nomProjet?: string;
  #localité?: Candidature.Localité.ValueType;
  #notifiéLe?: DateTime.ValueType;
  #cahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType =
    AppelOffre.RéférenceCahierDesCharges.initial;

  get projet() {
    return this.#projet;
  }

  #estNotifié: boolean = false;
  get estNotifié() {
    return this.#estNotifié;
  }

  get cahierDesCharges() {
    return this.#cahierDesCharges;
  }

  #abandon!: AggregateType<AbandonAggregate>;
  get abandon() {
    return this.#abandon;
  }

  #achèvement!: AggregateType<AchèvementAggregate>;
  get achèvement() {
    return this.#achèvement;
  }

  #producteur!: AggregateType<ProducteurAggregate>;
  get producteur() {
    return this.#producteur;
  }

  #puissance!: AggregateType<PuissanceAggregate>;
  get puissance() {
    return this.#puissance;
  }

  #actionnaire!: AggregateType<ActionnaireAggregate>;
  get actionnaire() {
    return this.#actionnaire;
  }

  #fournisseur!: AggregateType<FournisseurAggregate>;
  get fournisseur() {
    return this.#fournisseur;
  }

  #garantiesFinancières!: AggregateType<GarantiesFinancièresAggregate>;
  get garantiesFinancières() {
    return this.#garantiesFinancières;
  }

  async init(projet: ProjetAggregateRoot, loadAggregate: LoadAggregateV2) {
    this.#projet = projet;

    this.#abandon = await loadAggregate(
      `abandon|${this.projet.identifiantProjet.formatter()}`,
      AbandonAggregate,
    );
    await this.#abandon.init(this);

    this.#achèvement = await loadAggregate(
      `achevement|${this.projet.identifiantProjet.formatter()}`,
      AchèvementAggregate,
    );
    await this.#achèvement.init(this);

    this.#producteur = await loadAggregate(
      `producteur|${this.projet.identifiantProjet.formatter()}`,
      ProducteurAggregate,
    );
    await this.#producteur.init(this);

    this.#puissance = await loadAggregate(
      `puissance|${this.projet.identifiantProjet.formatter()}`,
      PuissanceAggregate,
    );
    await this.#puissance.init(this);

    this.#actionnaire = await loadAggregate(
      `actionnaire|${this.projet.identifiantProjet.formatter()}`,
      ActionnaireAggregate,
    );
    await this.#actionnaire.init(this);

    this.#fournisseur = await loadAggregate(
      `fournisseur|${this.projet.identifiantProjet.formatter()}`,
      FournisseurAggregate,
    );
    await this.#fournisseur.init(this);

    this.#garantiesFinancières = await loadAggregate(
      `garanties-financieres|${this.projet.identifiantProjet.formatter()}`,
      GarantiesFinancièresAggregate,
    );
    await this.#garantiesFinancières.init(this);
  }

  async notifier({ attestation: { format } }: { attestation: { format: string } }) {
    this.vérifierQueLeLauréatPeutÊtreNotifié();
    const { notifiéeLe, notifiéePar, nomProjet, localité } = this.#projet.candidature;
    const event: LauréatNotifiéEvent = {
      type: 'LauréatNotifié-V2',
      payload: {
        identifiantProjet: this.#projet.identifiantProjet.formatter(),
        notifiéLe: notifiéeLe.formatter(),
        notifiéPar: notifiéePar.formatter(),
        attestation: {
          format,
        },
        nomProjet,
        localité: mapToPlainObject(localité),
      },
    };

    await this.publish(event);

    await this.producteur.importer({
      identifiantProjet: this.#projet.identifiantProjet,
      dateImport: notifiéeLe,
      identifiantUtilisateur: notifiéePar,
      producteur: this.projet.candidature.nomCandidat,
    });

    await this.puissance.importer({
      importéeLe: notifiéeLe,
      puissance: this.projet.candidature.puissanceProductionAnnuelle,
    });

    await this.actionnaire.importer({
      importéLe: notifiéeLe,
      actionnaire: this.projet.candidature.sociétéMère,
    });

    await this.fournisseur.importer({
      évaluationCarboneSimplifiée: this.projet.candidature.evaluationCarboneSimplifiée,
      fournisseurs: this.projet.candidature.fournisseurs,
      importéLe: notifiéeLe,
      identifiantUtilisateur: notifiéePar,
    });

    await this.garantiesFinancières.importer();
  }

  async modifier({
    identifiantProjet,
    modifiéLe,
    modifiéPar,
    nomProjet,
    localité: { adresse1, adresse2, codePostal, commune, département, région },
  }: ModifierLauréatOptions) {
    this.vérifierQueLeLauréatExiste();
    const event: LauréatModifiéEvent = {
      type: 'LauréatModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        nomProjet,
        localité: {
          adresse1,
          adresse2,
          codePostal,
          commune,
          département,
          région,
        },
      },
    };

    await this.publish(event);
  }

  async choisirCahierDesCharges({
    identifiantProjet,
    modifiéLe,
    modifiéPar,
    cahierDesCharges,
  }: ChoisirCahierDesChargesOptions) {
    this.vérifierQueLeLauréatExiste();
    this.vérifierNiAbandonnéNiEnCoursAbandon();
    this.vérifierNonAchevé();
    if (this.#cahierDesCharges.estÉgaleÀ(cahierDesCharges)) {
      throw new CahierDesChargesNonModifiéError();
    }

    if (
      cahierDesCharges.type === 'modifié' &&
      !this.projet.période.cahiersDesChargesModifiésDisponibles.find((cdc) =>
        AppelOffre.RéférenceCahierDesCharges.bind(cdc).estÉgaleÀ(cahierDesCharges),
      )
    ) {
      throw new CahierDesChargesIndisponibleError();
    }

    if (
      cahierDesCharges.type === 'initial' &&
      !this.projet.appelOffre.doitPouvoirChoisirCDCInitial
    ) {
      throw new RetourAuCahierDesChargesInitialImpossibleError();
    }

    const event: CahierDesChargesChoisiEvent = {
      type: 'CahierDesChargesChoisi-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        cahierDesCharges: cahierDesCharges.formatter(),
      },
    };

    await this.publish(event);
  }

  private vérifierQueLeLauréatPeutÊtreNotifié() {
    if (this.#notifiéLe) {
      throw new LauréatDéjàNotifiéError();
    }
  }

  vérifierQueLeLauréatExiste() {
    if (!this.exists) {
      throw new LauréatNonTrouvéError();
    }
  }

  vérifierNiAbandonnéNiEnCoursAbandon() {
    if (this.projet.statut.estAbandonné()) {
      throw new ProjetAbandonnéError();
    }

    if (this.abandon.statut.estEnCours()) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }
  }

  vérifierNonAchevé() {
    if (this.projet.statut.estAchevé()) {
      throw new ProjetAchevéError();
    }
  }

  vérifierQueLeCahierDesChargesPermetUnChangement() {
    if (
      this.projet.période.choisirNouveauCahierDesCharges &&
      this.cahierDesCharges.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.initial)
    ) {
      throw new CahierDesChargesEmpêcheModificationError();
    }
  }

  vérifierQueLeChangementEstPossible() {
    this.vérifierQueLeLauréatExiste();
    this.vérifierNiAbandonnéNiEnCoursAbandon();
    this.vérifierNonAchevé();
    this.vérifierQueLeCahierDesChargesPermetUnChangement();
  }

  apply(event: LauréatEvent): void {
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, (event) => this.applyLauréatNotifiéV1(event))
      .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, (event) =>
        this.applyNomEtlocalitéLauréatImportés(event),
      )
      .with({ type: 'LauréatNotifié-V2' }, (event) => this.applyLauréatNotifié(event))
      .with({ type: 'LauréatModifié-V1' }, (event) => this.applyLauréatModifié(event))
      .with({ type: 'CahierDesChargesChoisi-V1' }, (event) =>
        this.applyCahierDesChargesChoisi(event),
      )
      .exhaustive();
  }

  private applyLauréatNotifiéV1({ payload: { notifiéLe } }: LauréatNotifiéV1Event) {
    this.#estNotifié = true;
    this.#notifiéLe = DateTime.convertirEnValueType(notifiéLe);
  }

  private applyNomEtlocalitéLauréatImportés({
    payload: { localité, nomProjet },
  }: NomEtLocalitéLauréatImportésEvent) {
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }

  private applyLauréatNotifié({
    payload: { notifiéLe, localité, nomProjet },
  }: LauréatNotifiéEvent) {
    this.#estNotifié = true;
    this.#notifiéLe = DateTime.convertirEnValueType(notifiéLe);
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }

  private applyLauréatModifié({ payload: { nomProjet, localité } }: LauréatModifiéEvent) {
    this.#nomProjet = nomProjet;
    this.#localité = Candidature.Localité.bind(localité);
  }

  private applyCahierDesChargesChoisi({
    payload: { cahierDesCharges },
  }: CahierDesChargesChoisiEvent) {
    this.#cahierDesCharges =
      AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesCharges);
  }
}
