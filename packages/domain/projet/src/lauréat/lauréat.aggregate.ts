import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType, mapToPlainObject } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';
import { Candidature } from '..';

import { StatutLauréat } from '.';

import { LauréatEvent } from './lauréat.event';
import {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
import { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
import { ModifierLauréatOptions } from './modifier/modifierLauréat.option';
import {
  CahierDesChargesIndisponibleError,
  CahierDesChargesNonModifiéError,
  LauréatDéjàNotifiéError,
  LauréatNonModifiéError,
  LauréatNonNotifiéError,
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
import { ReprésentantLégalAggregate } from './représentantLégal/représentantLégal.aggregate';
import { RaccordementAggregate } from './raccordement/raccordement.aggregate';
import { DélaiAggregate } from './délai/délai.aggregate';
import { TâchePlanifiéeAggregate } from './tâche-planifiée/tâchePlanifiée.aggregate';
import { TâcheAggregate } from './tâche/tâche.aggregate';
import { NotifierOptions } from './notifier/notifierLauréat.option';
import { InstallateurAggregate } from './installateur/installateur.aggregate';
import { InstallationAvecDispositifDeStockageAggregate } from './installation-avec-dispositif-de-stockage/installationAvecDispositifDeStockage.aggregate';
import { NatureDeLExploitationAggregate } from './nature-de-l-exploitation/natureDeLExploitation.aggregate';

export class LauréatAggregate extends AbstractAggregate<
  LauréatEvent,
  'lauréat',
  ProjetAggregateRoot
> {
  #nomProjet?: string;
  #localité?: Candidature.Localité.ValueType;
  #référenceCahierDesCharges: AppelOffre.RéférenceCahierDesCharges.ValueType =
    AppelOffre.RéférenceCahierDesCharges.initial;

  get projet() {
    return this.parent;
  }

  #notifiéLe?: DateTime.ValueType;
  get notifiéLe() {
    if (!this.#notifiéLe) {
      throw new LauréatNonNotifiéError();
    }

    return this.#notifiéLe;
  }

  #estNotifié: boolean = false;
  get estNotifié() {
    return this.#estNotifié;
  }

  get référenceCahierDesCharges() {
    return this.#référenceCahierDesCharges;
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

  #représentantLégal!: AggregateType<ReprésentantLégalAggregate>;
  get représentantLégal() {
    return this.#représentantLégal;
  }

  #fournisseur!: AggregateType<FournisseurAggregate>;
  get fournisseur() {
    return this.#fournisseur;
  }

  #délai!: AggregateType<DélaiAggregate>;
  get délai() {
    return this.#délai;
  }

  #installateur!: AggregateType<InstallateurAggregate>;
  get installateur() {
    return this.#installateur;
  }

  #raccordement!: AggregateType<RaccordementAggregate>;
  get raccordement() {
    return this.#raccordement;
  }

  #garantiesFinancières!: AggregateType<GarantiesFinancièresAggregate>;
  get garantiesFinancières() {
    return this.#garantiesFinancières;
  }

  #installationAvecDispositifDeStockage!: AggregateType<InstallationAvecDispositifDeStockageAggregate>;
  get installationAvecDispositifDeStockage() {
    return this.#installationAvecDispositifDeStockage;
  }

  #natureDeLExploitation!: AggregateType<NatureDeLExploitationAggregate>;
  get natureDeLExploitation() {
    return this.#natureDeLExploitation;
  }

  get statut() {
    this.vérifierQueLeLauréatExiste();

    if (this.achèvement.estAchevé) {
      return StatutLauréat.achevé;
    }

    if (this.abandon.statut.estAccordé()) {
      return StatutLauréat.abandonné;
    }

    return StatutLauréat.actif;
  }

  async init() {
    this.#abandon = await this.loadAggregate(
      AbandonAggregate,
      `abandon|${this.projet.identifiantProjet.formatter()}`,
    );

    await this.abandon.init();

    this.#achèvement = await this.loadAggregate(
      AchèvementAggregate,
      `achevement|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#producteur = await this.loadAggregate(
      ProducteurAggregate,
      `producteur|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#puissance = await this.loadAggregate(
      PuissanceAggregate,
      `puissance|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#actionnaire = await this.loadAggregate(
      ActionnaireAggregate,
      `actionnaire|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#représentantLégal = await this.loadAggregate(
      ReprésentantLégalAggregate,
      `représentant-légal|${this.projet.identifiantProjet.formatter()}`,
    );
    await this.représentantLégal.init();

    this.#fournisseur = await this.loadAggregate(
      FournisseurAggregate,
      `fournisseur|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#raccordement = await this.loadAggregate(
      RaccordementAggregate,
      `raccordement|${this.projet.identifiantProjet.formatter()}`,
    );
    await this.#raccordement.init();

    this.#garantiesFinancières = await this.loadAggregate(
      GarantiesFinancièresAggregate,
      `garanties-financieres|${this.projet.identifiantProjet.formatter()}`,
    );
    await this.#garantiesFinancières.init();

    this.#délai = await this.loadAggregate(
      DélaiAggregate,
      `délai|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#installateur = await this.loadAggregate(
      InstallateurAggregate,
      `installateur|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#installationAvecDispositifDeStockage = await this.loadAggregate(
      InstallationAvecDispositifDeStockageAggregate,
      `installation-avec-dispositif-de-stockage|${this.projet.identifiantProjet.formatter()}`,
    );

    this.#natureDeLExploitation = await this.loadAggregate(
      NatureDeLExploitationAggregate,
      `nature-de-l-exploitation|${this.projet.identifiantProjet.formatter()}`,
    );
  }

  async loadTâchePlanifiée(typeTâchePlanifiée: string) {
    return this.loadAggregate(
      TâchePlanifiéeAggregate,
      `tâche-planifiée|${typeTâchePlanifiée}#${this.projet.identifiantProjet.formatter()}`,
    );
  }

  async loadTâche(typeTâche: string) {
    return this.loadAggregate(
      TâcheAggregate,
      `tâche|${typeTâche}#${this.projet.identifiantProjet.formatter()}`,
    );
  }

  async notifier({
    attestation: { format },
    importerGarantiesFinancières,
    notifiéLe,
    notifiéPar,
  }: NotifierOptions) {
    this.vérifierQueLeLauréatPeutÊtreNotifié();

    const { nomProjet, localité } = this.projet.candidature;
    const event: LauréatNotifiéEvent = {
      type: 'LauréatNotifié-V2',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        notifiéLe: notifiéLe.formatter(),
        notifiéPar: notifiéPar.formatter(),
        attestation: {
          format,
        },
        nomProjet,
        localité: mapToPlainObject(localité),
      },
    };

    await this.publish(event);

    // Garanties Financières
    if (importerGarantiesFinancières) {
      await this.garantiesFinancières.importer({
        garantiesFinancières: this.projet.candidature.garantiesFinancières,
        importéLe: notifiéLe,
      });
    }

    // Champs soumis à demande
    await this.producteur.importer({
      identifiantProjet: this.projet.identifiantProjet,
      dateImport: notifiéLe,
      identifiantUtilisateur: notifiéPar,
      producteur: this.projet.candidature.nomCandidat,
    });

    await this.puissance.importer({
      importéeLe: notifiéLe,
      puissance: this.projet.candidature.puissanceProductionAnnuelle,
    });

    await this.actionnaire.importer({
      importéLe: notifiéLe,
      actionnaire: this.projet.candidature.sociétéMère,
    });

    await this.représentantLégal.importer({
      importéLe: notifiéLe,
      nomReprésentantLégal: this.projet.candidature.nomReprésentantLégal,
      importéPar: notifiéPar,
    });

    await this.fournisseur.importer({
      évaluationCarboneSimplifiée: this.projet.candidature.evaluationCarboneSimplifiée,
      fournisseurs: this.projet.candidature.fournisseurs,
      importéLe: notifiéLe,
      identifiantUtilisateur: notifiéPar,
    });

    // Champs supplémentaires, dont l'import dépend de l'appel d'offre
    if (this.projet.appelOffre.champsSupplémentaires?.installateur !== undefined) {
      await this.installateur.importer({
        installateur: this.projet.candidature.installateur ?? '',
        importéLe: notifiéLe,
        importéPar: notifiéPar,
      });
    }

    if (
      this.projet.appelOffre.champsSupplémentaires?.installationAvecDispositifDeStockage !==
        undefined &&
      this.projet.candidature.dépôt.installationAvecDispositifDeStockage !== undefined
    ) {
      await this.installationAvecDispositifDeStockage.importer({
        installationAvecDispositifDeStockage:
          this.projet.candidature.dépôt.installationAvecDispositifDeStockage,
        importéeLe: notifiéLe,
        importéePar: notifiéPar,
      });
    }

    if (
      this.projet.appelOffre.champsSupplémentaires?.natureDeLExploitation &&
      this.projet.candidature.natureDeLExploitation
    ) {
      await this.natureDeLExploitation.importer({
        natureDeLExploitation: this.projet.candidature.natureDeLExploitation,
        importéeLe: notifiéLe,
        importéePar: notifiéPar,
      });
    }

    await this.achèvement.calculerDateAchèvementPrévisionnel({ type: 'notification' });
  }

  async modifier({
    identifiantProjet,
    modifiéLe,
    modifiéPar,
    nomProjet,
    localité,
  }: ModifierLauréatOptions) {
    this.vérifierQueLeLauréatExiste();
    if (this.#nomProjet === nomProjet && this.#localité?.estÉgaleÀ(localité)) {
      throw new LauréatNonModifiéError();
    }
    const event: LauréatModifiéEvent = {
      type: 'LauréatModifié-V1',
      payload: {
        identifiantProjet: identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        nomProjet,
        localité: localité.formatter(),
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
    if (this.#référenceCahierDesCharges.estÉgaleÀ(cahierDesCharges)) {
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

    if (cahierDesCharges.estInitial() && !this.projet.appelOffre.doitPouvoirChoisirCDCInitial) {
      throw new RetourAuCahierDesChargesInitialImpossibleError();
    }

    const cdcAvantChoix = {
      référence: this.référenceCahierDesCharges,
      délaiApplicable:
        this.projet.cahierDesChargesActuel.cahierDesChargesModificatif?.délaiApplicable,
    };

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

    if (cdcAvantChoix.délaiApplicable) {
      const { délaiEnMois, intervaleDateMiseEnService } = cdcAvantChoix.délaiApplicable;

      if (this.raccordement.aUneDateDeMiseEnServiceDansIntervalle(intervaleDateMiseEnService)) {
        return this.achèvement.calculerDateAchèvementPrévisionnel({
          type: 'retrait-délai-cdc-30_08_2022',
          nombreDeMois: délaiEnMois,
        });
      }
    }

    const cdcChoisi = {
      référence: cahierDesCharges,
      délaiApplicable:
        this.projet.cahierDesChargesActuel.cahierDesChargesModificatif?.délaiApplicable,
    };

    if (cdcChoisi.délaiApplicable) {
      const { délaiEnMois, intervaleDateMiseEnService } = cdcChoisi.délaiApplicable;

      if (this.raccordement.aUneDateDeMiseEnServiceDansIntervalle(intervaleDateMiseEnService)) {
        return await this.achèvement.calculerDateAchèvementPrévisionnel({
          type: 'ajout-délai-cdc-30_08_2022',
          nombreDeMois: délaiEnMois,
        });
      }
    }
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

  vérifierNonAbandonné() {
    if (this.statut.estAbandonné()) {
      throw new ProjetAbandonnéError();
    }
  }

  vérifierPasEnCoursAbandon() {
    if (this.abandon.statut.estEnCours()) {
      throw new ProjetAvecDemandeAbandonEnCoursError();
    }
  }

  vérifierNiAbandonnéNiEnCoursAbandon() {
    this.vérifierNonAbandonné();
    this.vérifierPasEnCoursAbandon();
  }

  vérifierNonAchevé() {
    if (this.statut.estAchevé()) {
      throw new ProjetAchevéError();
    }
  }

  vérifierQueLeChangementEstPossible(
    typeChangement: 'information-enregistrée' | 'demande',
    domaine: AppelOffre.DomainesConcernésParChangement,
  ) {
    this.vérifierQueLeLauréatExiste();
    this.vérifierNiAbandonnéNiEnCoursAbandon();
    this.vérifierNonAchevé();
    this.projet.cahierDesChargesActuel.vérifierQueLeChangementEstPossible(typeChangement, domaine);
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
    this.#référenceCahierDesCharges =
      AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(cahierDesCharges);
  }
}
