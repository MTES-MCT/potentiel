import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';

import { CandidatureEvent } from './candidature.event';
import { CandidatureImportéeEvent } from './importer/candidatureImportée.event';
import { ImporterCandidatureOptions } from './importer/importerCandidature.options';
import * as StatutCandidature from './statutCandidature.valueType';
import * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';
import * as TypeActionnariat from './typeActionnariat.valueType';
import * as HistoriqueAbandon from './historiqueAbandon.valueType';
import * as TypeTechnologie from './typeTechnologie.valueType';
import {
  AttestationNonGénéréeError,
  CandidatureDéjàImportéeError,
  CandidatureNonModifiéeError,
  CandidatureNonTrouvéeError,
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
  GarantiesFinancièresRequisesPourAppelOffreError,
  PériodeAppelOffreLegacyError,
  StatutNonModifiableAprèsNotificationError,
  TypeGarantiesFinancièresNonModifiableAprèsNotificationError,
} from './candidature.error';
import { CorrigerCandidatureOptions } from './corriger/corrigerCandidature.options';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import * as Localité from './localité.valueType';

type CandidatureBehaviorOptions = CorrigerCandidatureOptions | ImporterCandidatureOptions;

export class CandidatureAggregate extends AbstractAggregate<CandidatureEvent> {
  #projet!: ProjetAggregateRoot;

  get projet() {
    return this.#projet;
  }

  #statut?: StatutCandidature.ValueType;
  #estNotifiée: boolean = false;
  #notifiéeLe?: DateTime.ValueType;
  #garantiesFinancières?: {
    type: TypeGarantiesFinancières.ValueType;
    dateEchéance?: DateTime.ValueType;
  };
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

  async init(projet: ProjetAggregateRoot) {
    this.#projet = projet;
  }

  async importer(candidature: ImporterCandidatureOptions) {
    this.vérifierQueLaCandidatureADéjàÉtéImportée();
    this.vérifierQueLaPériodeEstValide();
    this.vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);

    const event: CandidatureImportéeEvent = {
      type: 'CandidatureImportée-V1',
      payload: {
        ...this.mapToEventPayload(candidature),
        importéLe: candidature.importéLe.formatter(),
        importéPar: candidature.importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async corriger(candidature: CorrigerCandidatureOptions) {
    this.vérifierQueLaCandidatureExiste();
    this.vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);
    this.vérifierQueLeStatutEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLaRégénérationDeLAttestionEstPossible(candidature);
    this.vérifierQueLaCorrectionEstJustifiée(candidature);

    const event: CandidatureCorrigéeEvent = {
      type: 'CandidatureCorrigée-V1',
      payload: {
        ...this.mapToEventPayload(candidature),
        corrigéLe: candidature.corrigéLe.formatter(),
        corrigéPar: candidature.corrigéPar.formatter(),
        doitRégénérerAttestation: candidature.doitRégénérerAttestation,
        détailsMisÀJour: candidature.détailsMisÀJour,
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
          !this.#garantiesFinancières?.type ||
          !this.#garantiesFinancières?.type.estÉgaleÀ(candidature.typeGarantiesFinancières)
        ) {
          throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
        }
      } else if (this.#garantiesFinancières?.type) {
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
      actionnariat,
      dateÉchéanceGf,
      motifÉlimination,
      typeGarantiesFinancières,
    } = otherData;

    const nEstPasJustifiée =
      this.#emailContact === emailContact &&
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
      this.#statut === statut &&
      this.#technologie === technologie &&
      this.#territoireProjet === territoireProjet &&
      this.#actionnariat === actionnariat &&
      this.#dateÉchéanceGf === dateÉchéanceGf &&
      this.#motifÉlimination === motifÉlimination &&
      this.#typeGarantiesFinancières === typeGarantiesFinancières;

    if (!nEstPasJustifiée) {
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

  private vérifierQueLaCandidatureExiste() {
    if (!this.exists) {
      throw new CandidatureNonTrouvéeError();
    }
  }

  private vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre(
    candidature: CandidatureBehaviorOptions,
  ) {
    const soumisAuxGF =
      this.projet.famille?.soumisAuxGarantiesFinancieres ??
      this.projet.appelOffre.soumisAuxGarantiesFinancieres;
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

  private vérifierQueLaCandidatureADéjàÉtéImportée() {
    if (this.#statut) {
      throw new CandidatureDéjàImportéeError();
    }
  }

  private vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise(
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
          type: 'CandidatureCorrigée-V1',
        },
        (event) => this.applyCandidatureCorrigée(event),
      );
  }

  private applyCandidatureImportéeV1({ payload }: CandidatureImportéeEvent) {
    this.applyCommonEventPayload(payload);
  }

  private applyCandidatureCorrigée({ payload }: CandidatureCorrigéeEvent) {
    this.applyCommonEventPayload(payload);
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
    sociétéMère,
    statut,
    technologie,
    territoireProjet,
    actionnariat,
    dateÉchéanceGf,
    motifÉlimination,
    typeGarantiesFinancières,
  }: CandidatureCorrigéeEvent['payload'] | CandidatureImportéeEvent['payload']) {
    this.#statut = StatutCandidature.convertirEnValueType(statut);
    this.#nomProjet = nomProjet;
    this.#localité = Localité.bind(localité);
    if (typeGarantiesFinancières) {
      this.#garantiesFinancières = {
        type: TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières),
        dateEchéance: dateÉchéanceGf ? DateTime.convertirEnValueType(dateÉchéanceGf) : undefined,
      };
    }
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
    this.#motifÉlimination = motifÉlimination;
  }

  private mapToEventPayload = (
    candidature: ImporterCandidatureOptions | CorrigerCandidatureOptions,
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
  });
}
