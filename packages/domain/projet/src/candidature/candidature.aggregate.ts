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

type CandidatureBehaviorOptions = CorrigerCandidatureOptions | ImporterCandidatureOptions;

export class CandidatureAggregate extends AbstractAggregate<CandidatureEvent> {
  #projet!: ProjetAggregateRoot;

  get projet() {
    return this.#projet;
  }

  statut: StatutCandidature.ValueType = StatutCandidature.inconnu;
  estNotifiée: boolean = false;
  notifiéeLe?: DateTime.ValueType;
  garantiesFinancières?: {
    type: TypeGarantiesFinancières.ValueType;
    dateEchéance?: DateTime.ValueType;
  };
  nomReprésentantLégal: string = '';
  sociétéMère: string = '';
  puissance: number = 0;
  typeActionnariat?: TypeActionnariat.ValueType;
  nomProjet: string = '';
  localité: {
    adresse1: string;
    adresse2: string;
    codePostal: string;
    commune: string;
    région: string;
    département: string;
  } = {
    adresse1: '',
    adresse2: '',
    codePostal: '',
    commune: '',
    département: '',
    région: '',
  };
  emailContact: Email.ValueType = Email.inconnu;
  prixRéférence: number = 0;

  async init(projet: ProjetAggregateRoot) {
    this.#projet = projet;
  }

  async importer(this: CandidatureAggregate, candidature: ImporterCandidatureOptions) {
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

  async corriger(this: CandidatureAggregate, candidature: CorrigerCandidatureOptions) {
    this.vérifierQueLaCandidatureExiste();
    this.vérifierQueLesGarantiesFinancièresSontRequisesPourAppelOffre(candidature);
    this.vérifierQueLaDateÉchéanceGarantiesFinancièresEstRequise(candidature);
    this.vérifierQueLaDateÉchéanceNEstPasAttendue(candidature);
    this.vérifierQueLeStatutEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification(candidature);
    this.vérifierQueLaRégénérationDeLAttestionEstPossible(candidature);
    this.vérifierQueLaCorrectionEstApplicable(candidature);

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

    await this.publish(event); // check type ?
  }

  private vérifierQueLeTypeDesGarantiesFinancièresEstNonModifiableAprésNotification(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (this.estNotifiée) {
      if (candidature.typeGarantiesFinancières) {
        if (
          !this.garantiesFinancières?.type ||
          !this.garantiesFinancières?.type.estÉgaleÀ(candidature.typeGarantiesFinancières)
        ) {
          throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
        }
      } else if (this.garantiesFinancières?.type) {
        throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
      }
    }
  }

  private vérifierQueLeStatutEstNonModifiableAprésNotification(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (this.estNotifiée && !candidature.statut.estÉgaleÀ(this.statut)) {
      throw new StatutNonModifiableAprèsNotificationError();
    }
  }

  private vérifierQueLaCorrectionEstApplicable(candidature: CorrigerCandidatureOptions) {
    if (this.estIdentiqueÀ(event.payload)) {
      // todo réimpl à faire
      throw new CandidatureNonModifiéeError(candidature.nomProjet);
    }
  }

  private vérifierQueLaRégénérationDeLAttestionEstPossible(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (!this.estNotifiée && candidature.doitRégénérerAttestation) {
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
    if (!this.statut.estÉgaleÀ(StatutCandidature.inconnu)) {
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
    match(event).with(
      {
        type: 'CandidatureImportée-V1',
      },
      (event) => this.applyCandidatureImportéeV1(event),
    );
  }

  private applyCandidatureImportéeV1({ payload }: CandidatureImportéeEvent) {
    this.statut = StatutCandidature.convertirEnValueType(payload.statut);
    this.nomProjet = payload.nomProjet;
    this.localité = payload.localité;
    this.garantiesFinancières = payload.typeGarantiesFinancières
      ? {
          type: TypeGarantiesFinancières.convertirEnValueType(payload.typeGarantiesFinancières),
          dateEchéance:
            payload.dateÉchéanceGf && DateTime.convertirEnValueType(payload.dateÉchéanceGf),
        }
      : undefined;
    this.nomReprésentantLégal = payload.nomReprésentantLégal;
    this.sociétéMère = payload.sociétéMère;
    this.puissance = payload.puissanceProductionAnnuelle;
    this.typeActionnariat = payload.actionnariat
      ? TypeActionnariat.convertirEnValueType(payload.actionnariat)
      : undefined;
    this.emailContact = Email.convertirEnValueType(payload.emailContact);
    this.prixRéférence = payload.prixReference;
  }

  private mapToEventPayload = (
    candidature: ImporterCandidatureOptions | CorrigerCandidatureOptions,
  ) => ({
    identifiantProjet: candidature.identifiantProjet.formatter(),
    statut: candidature.statut.statut,
    technologie: candidature.technologie.type,
    dateÉchéanceGf: candidature.dateÉchéanceGf?.formatter(),
    historiqueAbandon: candidature.historiqueAbandon.formatter(),
    typeGarantiesFinancières: candidature.typeGarantiesFinancières?.type,
    nomProjet: candidature.nomProjet,
    sociétéMère: candidature.sociétéMère,
    nomCandidat: candidature.nomCandidat,
    puissanceProductionAnnuelle: candidature.puissanceProductionAnnuelle,
    prixReference: candidature.prixReference,
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
