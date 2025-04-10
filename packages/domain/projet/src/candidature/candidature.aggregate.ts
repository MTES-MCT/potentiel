import { match } from 'ts-pattern';

import { Email } from '@potentiel-domain/common';
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
import * as DépôtCandidature from './dépôtCandidature.valueType';
import * as InstructionCandidature from './instructionCandidature.valueType';
import {
  AttestationNonGénéréeError,
  CandidatureDéjàImportéeError,
  CandidatureDéjàNotifiéeError,
  CandidatureNonModifiéeError,
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
  TypeGarantiesFinancièresNonModifiableAprèsNotificationError,
} from './candidature.error';
import { CorrigerCandidatureOptions } from './corriger/corrigerCandidature.options';
import { CandidatureCorrigéeEvent } from './corriger/candidatureCorrigée.event';
import * as Localité from './localité.valueType';
import { NotifierOptions } from './notifier/notifierCandidature.options';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';

type CandidatureBehaviorOptions = CorrigerCandidatureOptions | ImporterCandidatureOptions;

export class CandidatureAggregate extends AbstractAggregate<CandidatureEvent> {
  #projet!: ProjetAggregateRoot;

  get projet() {
    return this.#projet;
  }

  #dépôt?: DépôtCandidature.ValueType;
  #instruction?: InstructionCandidature.ValueType;
  #estNotifiée: boolean = false;

  async init(projet: ProjetAggregateRoot) {
    this.#projet = projet;
  }

  async importer(candidature: ImporterCandidatureOptions) {
    this.vérifierQueLaCandidatureADéjàÉtéImportée();
    this.vérifierQueLaPériodeEstValide();
    this.vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);
    this.vérifierCoefficientKChoisi(candidature);

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
    this.vérifierCoefficientKChoisi(candidature);
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

  private vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification({
    dépôtCandidature,
  }: CorrigerCandidatureOptions) {
    if (this.#estNotifiée) {
      if (dépôtCandidature.typeGarantiesFinancières) {
        if (
          !this.#dépôt?.typeGarantiesFinancières?.type ||
          !this.#dépôt?.typeGarantiesFinancières?.estÉgaleÀ(
            dépôtCandidature.typeGarantiesFinancières,
          )
        ) {
          throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
        }
      } else if (this.#dépôt?.typeGarantiesFinancières?.type) {
        throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
      }
    }
  }

  private vérifierQueLeStatutEstNonModifiableAprésNotification({
    instructionCandidature,
  }: CorrigerCandidatureOptions) {
    if (
      this.#estNotifiée &&
      this.#instruction &&
      !instructionCandidature.statut.estÉgaleÀ(this.#instruction.statut)
    ) {
      throw new StatutNonModifiableAprèsNotificationError();
    }
  }

  private vérifierQueLaCorrectionEstJustifiée({
    corrigéLe: _corrigéLe,
    corrigéPar: _corrigéPar,
    doitRégénérerAttestation: _doitRégénérerAttestation,
    détailsMisÀJour: _détailsMisÀJour,
    instructionCandidature,
    dépôtCandidature,
  }: CorrigerCandidatureOptions) {
    if (
      this.#instruction?.statut.estÉgaleÀ(instructionCandidature.statut) &&
      this.#dépôt?.estÉgaleÀ(dépôtCandidature)
    ) {
      throw new CandidatureNonModifiéeError(dépôtCandidature.nomProjet);
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

  private vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre({
    instructionCandidature,
    dépôtCandidature,
  }: CandidatureBehaviorOptions) {
    const soumisAuxGF =
      this.projet.famille?.soumisAuxGarantiesFinancieres ??
      this.projet.appelOffre.soumisAuxGarantiesFinancieres;
    if (
      soumisAuxGF === 'à la candidature' &&
      instructionCandidature.statut.estClassé() &&
      !dépôtCandidature.typeGarantiesFinancières
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
    if (this.#instruction?.statut) {
      throw new CandidatureDéjàImportéeError();
    }
  }

  private vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise({
    instructionCandidature,
    dépôtCandidature,
  }: CandidatureBehaviorOptions) {
    if (
      instructionCandidature.statut.estClassé() &&
      dépôtCandidature.typeGarantiesFinancières &&
      dépôtCandidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
      !dépôtCandidature.dateÉchéanceGf
    ) {
      throw new DateÉchéanceGarantiesFinancièresRequiseError();
    }
  }

  private vérifierQueLaDateÉchéanceNEstPasAttendue({
    instructionCandidature,
    dépôtCandidature,
  }: CandidatureBehaviorOptions) {
    if (
      instructionCandidature.statut.estClassé() &&
      dépôtCandidature.typeGarantiesFinancières &&
      !dépôtCandidature.typeGarantiesFinancières.estAvecDateÉchéance() &&
      dépôtCandidature.dateÉchéanceGf
    ) {
      throw new DateÉchéanceNonAttendueError();
    }
  }

  private vérifierCoefficientKChoisi({ dépôtCandidature }: CandidatureBehaviorOptions) {
    if (
      this.projet.période.choixCoefficientKDisponible &&
      dépôtCandidature.coefficientKChoisi === undefined
    ) {
      throw new ChoixCoefficientKRequisError();
    }
    if (
      !this.projet.période.choixCoefficientKDisponible &&
      dépôtCandidature.coefficientKChoisi !== undefined
    ) {
      throw new ChoixCoefficientKNonAttenduError();
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

  private applyCandidatureImportéeV1({ payload }: CandidatureImportéeEvent) {
    this.applyCommonEventPayload(payload);
  }

  private applyCandidatureCorrigée({ payload }: CandidatureCorrigéeEvent) {
    this.applyCommonEventPayload(payload);
  }

  private applyCandidatureNotifiée(
    this: CandidatureAggregate,
    _: CandidatureNotifiéeEvent | CandidatureNotifiéeEventV1,
  ) {
    this.#estNotifiée = true;
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
  }: CandidatureCorrigéeEvent['payload'] | CandidatureImportéeEvent['payload']) {
    this.#instruction = InstructionCandidature.bind({
      noteTotale,
      statut: StatutCandidature.convertirEnValueType(statut),
      motifÉlimination,
    });

    this.#dépôt = DépôtCandidature.bind({
      nomProjet,
      localité: Localité.bind(localité),
      typeGarantiesFinancières: typeGarantiesFinancières
        ? TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières)
        : undefined,
      dateÉchéanceGf: dateÉchéanceGf
        ? {
            date: dateÉchéanceGf,
          }
        : undefined,
      actionnariat: actionnariat ? TypeActionnariat.convertirEnValueType(actionnariat) : undefined,
      emailContact: Email.convertirEnValueType(emailContact),
      prixRéférence: prixReference,
      sociétéMère,
      nomReprésentantLégal,
      puissanceProductionAnnuelle,
      evaluationCarboneSimplifiée,
      historiqueAbandon: HistoriqueAbandon.convertirEnValueType(historiqueAbandon),
      nomCandidat,
      puissanceALaPointe,
      technologie: TypeTechnologie.convertirEnValueType(technologie),
      coefficientKChoisi,
      territoireProjet,
    });
  }

  private mapToEventPayload = ({
    dépôtCandidature,
    instructionCandidature,
  }: ImporterCandidatureOptions | CorrigerCandidatureOptions) => ({
    identifiantProjet: this.projet.identifiantProjet.formatter(),
    statut: instructionCandidature.statut.formatter(),
    technologie: dépôtCandidature.technologie.formatter(),
    dateÉchéanceGf: dépôtCandidature?.dateÉchéanceGf?.formatter(),
    historiqueAbandon: dépôtCandidature.historiqueAbandon.formatter(),
    typeGarantiesFinancières: dépôtCandidature.typeGarantiesFinancières?.type,
    nomProjet: dépôtCandidature.nomProjet,
    sociétéMère: dépôtCandidature.sociétéMère,
    nomCandidat: dépôtCandidature.nomCandidat,
    puissanceProductionAnnuelle: dépôtCandidature.puissanceProductionAnnuelle,
    prixReference: dépôtCandidature.prixRéférence,
    noteTotale: instructionCandidature.noteTotale,
    nomReprésentantLégal: dépôtCandidature.nomReprésentantLégal,
    emailContact: dépôtCandidature.emailContact.formatter(),
    localité: dépôtCandidature.localité,
    motifÉlimination: instructionCandidature.motifÉlimination,
    puissanceALaPointe: dépôtCandidature.puissanceALaPointe,
    evaluationCarboneSimplifiée: dépôtCandidature.evaluationCarboneSimplifiée,
    actionnariat: dépôtCandidature.actionnariat?.formatter(),
    territoireProjet: dépôtCandidature.territoireProjet,
    coefficientKChoisi: dépôtCandidature.coefficientKChoisi,
  });
}
