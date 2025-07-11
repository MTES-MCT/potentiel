import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';
import { FournisseurImportéEvent, Fournisseur } from '../lauréat/fournisseur';

import { CandidatureEvent } from './candidature.event';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';
import { ImporterCandidatureOptions } from './importer/importerCandidature.options';
import * as StatutCandidature from './statutCandidature.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import {
  AttestationNonGénéréeError,
  CandidatureDéjàImportéeError,
  CandidatureDéjàNotifiéeError,
  CandidatureNonModifiéeError,
  CandidatureNonNotifiéeError,
  CandidatureNonTrouvéeError,
  ChoixCoefficientKNonAttenduError,
  ChoixCoefficientKRequisError,
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
  FonctionManquanteError,
  GarantiesFinancièresRequisesPourAppelOffreError,
  NomManquantError,
  PériodeAppelOffreLegacyError,
  StatutNonModifiableAprèsNotificationError,
  TechnologieIndisponibleError,
  TechnologieRequiseError,
  TypeGarantiesFinancièresNonModifiableAprèsNotificationError,
} from './candidature.error';
import { CorrigerCandidatureOptions } from './corriger/corrigerCandidature.options';
import {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event';
import * as Localité from './localité.valueType';
import { NotifierOptions } from './notifier/notifierCandidature.options';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';

type CandidatureBehaviorOptions = CorrigerCandidatureOptions | ImporterCandidatureOptions;

export class CandidatureAggregate extends AbstractAggregate<
  CandidatureEvent,
  'candidature',
  ProjetAggregateRoot
> {
  get projet() {
    return this.parent;
  }

  #statut?: StatutCandidature.ValueType;
  #estNotifiée: boolean = false;
  #notifiéeLe?: DateTime.ValueType;
  #notifiéePar?: Email.ValueType;
  #nomCandidat: string = '';
  #nomReprésentantLégal: string = '';
  #sociétéMère: string = '';
  #noteTotale: number = 0;
  #actionnariat?: TypeActionnariat.ValueType;
  #nomProjet: string = '';
  #localité?: Localité.ValueType;
  #emailContact: Email.ValueType = Email.inconnu;
  #prixRéférence: number = 0;
  #evaluationCarboneSimplifiée: number = 0;
  #historiqueAbandon?: HistoriqueAbandon.ValueType;
  #typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  #motifÉlimination?: string;
  #technologie?: TypeTechnologie.ValueType;
  #dateÉchéanceGf?: DateTime.ValueType;
  #puissanceALaPointe?: boolean;
  #puissanceProductionAnnuelle: number = 0;
  #territoireProjet: string = '';
  #coefficientKChoisi?: boolean;
  #fournisseurs: Array<Fournisseur.ValueType> = [];

  get estNotifiée() {
    return !!this.notifiéeLe;
  }

  get notifiéeLe() {
    if (!this.#notifiéeLe) {
      throw new CandidatureNonNotifiéeError();
    }
    return this.#notifiéeLe;
  }

  get notifiéePar() {
    if (!this.#notifiéePar) {
      throw new CandidatureNonNotifiéeError();
    }
    return this.#notifiéePar;
  }

  get statut() {
    if (!this.#statut) {
      throw new CandidatureNonTrouvéeError();
    }
    return this.#statut;
  }

  get nomProjet() {
    return this.#nomProjet;
  }

  get nomReprésentantLégal() {
    return this.#nomReprésentantLégal;
  }

  get emailContact() {
    return this.#emailContact;
  }

  get sociétéMère() {
    return this.#sociétéMère;
  }

  get puissanceProductionAnnuelle() {
    return this.#puissanceProductionAnnuelle;
  }

  get prixRéférence() {
    return this.#prixRéférence;
  }

  get typeGarantiesFinancières() {
    return this.#typeGarantiesFinancières;
  }

  get dateÉchéanceGf() {
    return this.#dateÉchéanceGf;
  }

  get typeActionnariat() {
    return this.#actionnariat;
  }

  get technologie(): TypeTechnologie.ValueType<AppelOffre.Technologie> {
    return TypeTechnologie.déterminer({
      appelOffre: this.projet.appelOffre,
      projet: {
        technologie: this.#technologie?.type ?? 'N/A',
      },
    });
  }

  get noteTotale() {
    return this.#noteTotale;
  }

  get localité() {
    return this.#localité!;
  }

  get nomCandidat() {
    return this.#nomCandidat;
  }

  get evaluationCarboneSimplifiée() {
    return this.#evaluationCarboneSimplifiée;
  }

  get fournisseurs() {
    return this.#fournisseurs;
  }

  async importer(candidature: ImporterCandidatureOptions) {
    this.vérifierSiLaCandidatureADéjàÉtéImportée();
    this.vérifierQueLaPériodeEstValide();
    this.vérifierSiLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierSiLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);
    this.vérifierCoefficientKChoisi(candidature);
    this.vérifierTechnologie(candidature);

    const event: CandidatureImportéeEvent = {
      type: 'CandidatureImportée-V2',
      payload: {
        ...this.mapToEventPayload(candidature),
        fournisseurs: candidature.fournisseurs.map((fournisseur) => fournisseur.formatter()),
        importéLe: candidature.importéLe.formatter(),
        importéPar: candidature.importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async corriger(candidature: CorrigerCandidatureOptions) {
    this.vérifierQueLaCandidatureExiste();
    this.vérifierSiLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierSiLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);
    this.vérifierQueLeStatutEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLaRégénérationDeLAttestionEstPossible(candidature);
    this.vérifierCoefficientKChoisi(candidature);
    this.vérifierTechnologie(candidature);
    this.vérifierQueLaCorrectionEstJustifiée(candidature);

    const event: CandidatureCorrigéeEvent = {
      type: 'CandidatureCorrigée-V2',
      payload: {
        ...this.mapToEventPayload(candidature),
        fournisseurs: candidature.fournisseurs.map((fournisseur) => fournisseur.formatter()),
        corrigéLe: candidature.corrigéLe.formatter(),
        corrigéPar: candidature.corrigéPar.formatter(),
        doitRégénérerAttestation: candidature.doitRégénérerAttestation,
        détailsMisÀJour: candidature.détailsMisÀJour,
      },
    };

    await this.publish(event);
  }

  async notifier({
    notifiéeLe,
    notifiéePar,
    validateur,
    attestation: { format },
  }: NotifierOptions) {
    if (this.#estNotifiée) {
      throw new CandidatureDéjàNotifiéeError(this.projet.identifiantProjet);
    }

    if (!validateur.fonction) {
      throw new FonctionManquanteError();
    }

    if (!validateur.nomComplet) {
      throw new NomManquantError();
    }

    const event: CandidatureNotifiéeEvent = {
      type: 'CandidatureNotifiée-V2',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        notifiéeLe: notifiéeLe.formatter(),
        notifiéePar: notifiéePar.formatter(),
        validateur,
        attestation: {
          format,
        },
      },
    };

    await this.publish(event);
  }

  private vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (this.#estNotifiée) {
      if (candidature.typeGarantiesFinancières) {
        if (
          !this.#typeGarantiesFinancières?.type ||
          !this.#typeGarantiesFinancières?.estÉgaleÀ(candidature.typeGarantiesFinancières)
        ) {
          throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
        }
      } else if (this.#typeGarantiesFinancières?.type) {
        throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
      }
    }
  }

  private vérifierQueLeStatutEstNonModifiableAprésNotification(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (this.#estNotifiée && this.#statut && !candidature.statut.estÉgaleÀ(this.#statut)) {
      throw new StatutNonModifiableAprèsNotificationError();
    }
  }

  private vérifierQueLaCorrectionEstJustifiée({
    corrigéLe: _corrigéLe,
    corrigéPar: _corrigéPar,
    doitRégénérerAttestation: _doitRégénérerAttestation,
    détailsMisÀJour: _détailsMisÀJour,
    ...otherData
  }: CorrigerCandidatureOptions) {
    const {
      emailContact,
      evaluationCarboneSimplifiée,
      historiqueAbandon,
      localité,
      nomCandidat,
      nomProjet,
      nomReprésentantLégal,
      noteTotale,
      prixRéférence,
      puissanceALaPointe,
      puissanceProductionAnnuelle,
      sociétéMère,
      statut,
      technologie,
      territoireProjet,
      coefficientKChoisi,
      actionnariat,
      dateÉchéanceGf,
      motifÉlimination,
      typeGarantiesFinancières,
    } = otherData;

    const dépôtEstÉgale =
      this.#emailContact.estÉgaleÀ(emailContact) &&
      this.#evaluationCarboneSimplifiée === evaluationCarboneSimplifiée &&
      this.#historiqueAbandon?.estÉgaleÀ(historiqueAbandon) &&
      this.#localité?.estÉgaleÀ(Localité.bind(localité)) &&
      this.#nomCandidat === nomCandidat &&
      this.#nomProjet === nomProjet &&
      this.#nomReprésentantLégal === nomReprésentantLégal &&
      this.#noteTotale === noteTotale &&
      this.#prixRéférence === prixRéférence &&
      this.#puissanceALaPointe === puissanceALaPointe &&
      this.#puissanceProductionAnnuelle === puissanceProductionAnnuelle &&
      this.#sociétéMère === sociétéMère &&
      this.#statut?.estÉgaleÀ(statut) &&
      this.#technologie?.estÉgaleÀ(technologie) &&
      this.#territoireProjet === territoireProjet &&
      this.#coefficientKChoisi === coefficientKChoisi &&
      (actionnariat === undefined
        ? this.#actionnariat === undefined
        : this.#actionnariat?.estÉgaleÀ(actionnariat)) &&
      (dateÉchéanceGf === undefined
        ? this.#dateÉchéanceGf === undefined
        : this.#dateÉchéanceGf?.estÉgaleÀ(dateÉchéanceGf)) &&
      this.#motifÉlimination === motifÉlimination &&
      (typeGarantiesFinancières === undefined
        ? this.#typeGarantiesFinancières === undefined
        : this.#typeGarantiesFinancières?.estÉgaleÀ(typeGarantiesFinancières));

    if (dépôtEstÉgale) {
      throw new CandidatureNonModifiéeError(otherData.nomProjet);
    }
  }

  private vérifierQueLaRégénérationDeLAttestionEstPossible(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (!this.#estNotifiée && candidature.doitRégénérerAttestation) {
      throw new AttestationNonGénéréeError();
    }
  }

  vérifierQueLaCandidatureExiste() {
    if (!this.exists) {
      throw new CandidatureNonTrouvéeError();
    }
  }

  private vérifierSiLesGarantiesFinancièresSontRequisesPourAppelOffre(
    candidature: CandidatureBehaviorOptions,
  ) {
    const soumisAuxGF =
      this.projet.famille?.garantiesFinancières.soumisAuxGarantiesFinancieres ??
      this.projet.appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres;
    if (
      soumisAuxGF === 'à la candidature' &&
      candidature.statut.estClassé() &&
      !candidature.typeGarantiesFinancières
    ) {
      throw new GarantiesFinancièresRequisesPourAppelOffreError();
    }
  }

  private vérifierQueLaPériodeEstValide() {
    if (this.projet.période.type === 'legacy') {
      throw new PériodeAppelOffreLegacyError(
        this.projet.identifiantProjet.appelOffre,
        this.projet.identifiantProjet.période,
      );
    }
  }

  private vérifierSiLaCandidatureADéjàÉtéImportée() {
    if (this.#statut) {
      throw new CandidatureDéjàImportéeError();
    }
  }

  private vérifierSiLaDateÉchéanceGarantiesFinancièresEstRequise(
    candidature: CandidatureBehaviorOptions,
  ) {
    if (
      candidature.statut.estClassé() &&
      candidature.typeGarantiesFinancières &&
      candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
      !candidature.dateÉchéanceGf
    ) {
      throw new DateÉchéanceGarantiesFinancièresRequiseError();
    }
  }

  private vérifierQueLaDateÉchéanceNEstPasAttendue(candidature: CandidatureBehaviorOptions) {
    if (
      candidature.statut.estClassé() &&
      candidature.typeGarantiesFinancières &&
      !candidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
      candidature.dateÉchéanceGf
    ) {
      throw new DateÉchéanceNonAttendueError();
    }
  }

  private vérifierCoefficientKChoisi(candidature: CandidatureBehaviorOptions) {
    if (
      this.projet.champsSupplémentaires.coefficientKChoisi === 'requis' &&
      candidature.coefficientKChoisi === undefined
    ) {
      throw new ChoixCoefficientKRequisError();
    }
    if (
      !this.projet.champsSupplémentaires.coefficientKChoisi &&
      candidature.coefficientKChoisi !== undefined
    ) {
      throw new ChoixCoefficientKNonAttenduError();
    }
  }

  private vérifierTechnologie(candidature: CandidatureBehaviorOptions) {
    if (this.projet.appelOffre.multiplesTechnologies) {
      if (candidature.technologie.estNonApplicable()) {
        throw new TechnologieRequiseError();
      }
    } else if (
      !candidature.technologie.estNonApplicable() &&
      !candidature.technologie.estÉgaleÀ(
        TypeTechnologie.convertirEnValueType(this.projet.appelOffre.technologie),
      )
    ) {
      throw new TechnologieIndisponibleError();
    }
  }

  apply(event: CandidatureEvent): void {
    match(event)
      .with(
        {
          type: 'CandidatureImportée-V1',
        },
        (event) => this.applyCandidatureImportéeV1(event),
      )
      .with(
        {
          type: 'DétailsFournisseursCandidatureImportés-V1',
        },
        (event) => this.applyFournisseursImportésEventPayload(event),
      )
      .with(
        {
          type: 'CandidatureImportée-V2',
        },
        (event) => this.applyCandidatureImportée(event),
      )
      .with(
        {
          type: 'CandidatureCorrigée-V1',
        },
        (event) => this.applyCandidatureCorrigéeV1(event),
      )
      .with(
        {
          type: 'CandidatureCorrigée-V2',
        },
        (event) => this.applyCandidatureCorrigée(event),
      )
      .with(
        {
          type: 'CandidatureNotifiée-V1',
        },
        (event) => this.applyCandidatureNotifiée(event),
      )
      .with(
        {
          type: 'CandidatureNotifiée-V2',
        },
        (event) => this.applyCandidatureNotifiée(event),
      )
      .exhaustive();
  }

  private applyCandidatureImportéeV1({ payload }: CandidatureImportéeEventV1) {
    this.applyCommonEventPayload(payload);
  }

  private applyCandidatureImportée({ payload }: CandidatureImportéeEvent) {
    this.applyCommonEventPayload(payload);
    this.applyFournisseurEventPayload(payload.fournisseurs);
  }

  private applyCandidatureCorrigéeV1({ payload }: CandidatureCorrigéeEventV1) {
    this.applyCommonEventPayload(payload);
  }

  private applyCandidatureCorrigée({ payload }: CandidatureCorrigéeEvent) {
    this.applyCommonEventPayload(payload);
    this.applyFournisseurEventPayload(payload.fournisseurs);
  }

  private applyFournisseursImportésEventPayload({
    payload,
  }: DétailsFournisseursCandidatureImportésEvent) {
    this.applyFournisseurEventPayload(payload.fournisseurs);
  }

  private applyCandidatureNotifiée(
    this: CandidatureAggregate,
    event: CandidatureNotifiéeEvent | CandidatureNotifiéeEventV1,
  ) {
    this.#estNotifiée = true;
    this.#notifiéeLe = DateTime.convertirEnValueType(event.payload.notifiéeLe);
    this.#notifiéePar = Email.convertirEnValueType(event.payload.notifiéePar);
  }

  private applyCommonEventPayload({
    emailContact,
    evaluationCarboneSimplifiée,
    historiqueAbandon,
    localité,
    nomCandidat,
    nomProjet,
    nomReprésentantLégal,
    noteTotale,
    prixReference,
    puissanceALaPointe,
    puissanceProductionAnnuelle,
    technologie,
    territoireProjet,
    coefficientKChoisi,
    actionnariat,
    dateÉchéanceGf,
    motifÉlimination,
    typeGarantiesFinancières,
    sociétéMère,
    statut,
  }:
    | CandidatureImportéeEvent['payload']
    | CandidatureCorrigéeEventV1['payload']
    | CandidatureImportéeEventV1['payload']
    | CandidatureCorrigéeEvent['payload']) {
    this.#statut = StatutCandidature.convertirEnValueType(statut);
    this.#nomProjet = nomProjet;
    this.#localité = Localité.bind(localité);
    this.#typeGarantiesFinancières = typeGarantiesFinancières
      ? TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières)
      : undefined;

    this.#dateÉchéanceGf = dateÉchéanceGf
      ? DateTime.convertirEnValueType(dateÉchéanceGf)
      : undefined;

    this.#actionnariat = actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined;
    this.#emailContact = Email.convertirEnValueType(emailContact);
    this.#prixRéférence = prixReference;
    this.#sociétéMère = sociétéMère;
    this.#nomReprésentantLégal = nomReprésentantLégal;
    this.#puissanceProductionAnnuelle = puissanceProductionAnnuelle;
    this.#evaluationCarboneSimplifiée = evaluationCarboneSimplifiée;
    this.#historiqueAbandon = HistoriqueAbandon.convertirEnValueType(historiqueAbandon);
    this.#nomCandidat = nomCandidat;
    this.#noteTotale = noteTotale;
    this.#puissanceALaPointe = puissanceALaPointe;
    this.#technologie = TypeTechnologie.convertirEnValueType(technologie);
    this.#territoireProjet = territoireProjet;
    this.#coefficientKChoisi = coefficientKChoisi;
    this.#motifÉlimination = motifÉlimination;
  }

  private applyFournisseurEventPayload(
    fournisseurs:
      | FournisseurImportéEvent['payload']['fournisseurs']
      | CandidatureImportéeEvent['payload']['fournisseurs'],
  ) {
    this.#fournisseurs = fournisseurs.map(Fournisseur.convertirEnValueType);
  }

  private mapToEventPayload = (
    candidature: Omit<ImporterCandidatureOptions, 'fournisseurs'> | CorrigerCandidatureOptions,
  ) => ({
    identifiantProjet: this.projet.identifiantProjet.formatter(),
    statut: candidature.statut.statut,
    technologie: candidature.technologie.type,
    dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),
    historiqueAbandon: candidature.historiqueAbandon.formatter(),
    typeGarantiesFinancières: candidature.typeGarantiesFinancières?.type,
    nomProjet: candidature.nomProjet,
    sociétéMère: candidature.sociétéMère,
    nomCandidat: candidature.nomCandidat,
    puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
    prixReference: candidature.prixRéférence,
    noteTotale: candidature.noteTotale,
    nomReprésentantLégal: candidature.nomReprésentantLégal,
    emailContact: candidature.emailContact.formatter(),
    localité: candidature.localité,
    motifÉlimination: candidature.motifÉlimination,
    puissanceALaPointe: candidature.puissanceALaPointe,
    evaluationCarboneSimplifiée: candidature.evaluationCarboneSimplifiée,
    actionnariat: candidature.actionnariat?.formatter(),
    territoireProjet: candidature.territoireProjet,
    coefficientKChoisi: candidature.coefficientKChoisi,
    typeInstallationsAgrivoltaiques: candidature.typeInstallationsAgrivoltaiques?.formatter(),
    élémentsSousOmbrière: candidature.élémentsSousOmbrière,
    typologieDeBâtiment: candidature.typologieDeBâtiment?.formatter(),
    obligationDeSolarisation: candidature.obligationDeSolarisation,
  });
}
