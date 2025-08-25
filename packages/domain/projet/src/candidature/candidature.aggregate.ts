import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { AbstractAggregate } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { ProjetAggregateRoot } from '../projet.aggregateRoot';
import { FournisseurImportéEvent } from '../lauréat/fournisseur';

import { Dépôt, Instruction, VolumeRéservé } from '.';

import { CandidatureEvent } from './candidature.event';
import {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';
import { ImporterCandidatureOptions } from './importer/importerCandidature.options';
import * as TypeTechnologie from './typeTechnologie.valueType';
import {
  AttestationNonGénéréeError,
  AutorisationDUrbanismeRequiseError,
  CandidatureDéjàImportéeError,
  CandidatureDéjàNotifiéeError,
  CandidatureNonModifiéeError,
  CandidatureNonNotifiéeError,
  CandidatureNonTrouvéeError,
  ChoixCoefficientKNonAttenduError,
  ChoixCoefficientKRequisError,
  DateAutorisationDUrbanismeError,
  FonctionManquanteError,
  NomManquantError,
  PuissanceDeSiteNonAttendueError,
  PuissanceDeSiteRequiseError,
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

  #dépôt?: Dépôt.ValueType;
  #instruction?: Instruction.ValueType;
  #estNotifiée: boolean = false;
  #notifiéeLe?: DateTime.ValueType;
  #notifiéePar?: Email.ValueType;

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
    if (!this.#instruction) {
      throw new CandidatureNonTrouvéeError();
    }
    return this.#instruction.statut;
  }

  get dépôt() {
    if (!this.#dépôt) {
      throw new CandidatureNonTrouvéeError();
    }
    return this.#dépôt;
  }
  get instruction() {
    if (!this.#instruction) {
      throw new CandidatureNonTrouvéeError();
    }
    return this.#instruction;
  }

  get nomProjet() {
    return this.dépôt.nomProjet;
  }

  get nomReprésentantLégal() {
    return this.dépôt.nomReprésentantLégal;
  }

  get emailContact() {
    return this.dépôt.emailContact;
  }

  get sociétéMère() {
    return this.dépôt.sociétéMère;
  }

  get puissanceProductionAnnuelle() {
    return this.dépôt.puissanceProductionAnnuelle;
  }

  get prixRéférence() {
    return this.dépôt.prixReference;
  }

  get garantiesFinancières() {
    return this.dépôt.garantiesFinancières;
  }

  get typeActionnariat() {
    return this.dépôt.actionnariat;
  }

  get technologie(): TypeTechnologie.ValueType<AppelOffre.Technologie> {
    return TypeTechnologie.déterminer({
      appelOffre: this.projet.appelOffre,
      projet: {
        technologie: this.dépôt.technologie?.type ?? 'N/A',
      },
    });
  }

  get volumeRéservé() {
    return VolumeRéservé.déterminer({
      note: this.noteTotale,
      période: this.projet.période,
      puissanceInitiale: this.puissanceProductionAnnuelle,
    });
  }

  get noteTotale() {
    return this.instruction.noteTotale;
  }

  get localité() {
    return this.dépôt.localité!;
  }

  get nomCandidat() {
    return this.dépôt.nomCandidat;
  }

  get evaluationCarboneSimplifiée() {
    return this.dépôt.evaluationCarboneSimplifiée;
  }

  get fournisseurs() {
    return this.dépôt.fournisseurs;
  }

  async importer(candidature: ImporterCandidatureOptions) {
    this.vérifierSiLaCandidatureADéjàÉtéImportée();
    this.vérifierQueLaPériodeEstValide();
    this.vérifierChampSupplémentaires(candidature);
    this.vérifierTechnologie(candidature);

    if (candidature.instruction.statut.estClassé()) {
      this.projet.lauréat.garantiesFinancières.vérifierSiLesGarantiesFinancièresSontValides(
        candidature.dépôt.garantiesFinancières,
      );
    }

    const event: CandidatureImportéeEvent = {
      type: 'CandidatureImportée-V2',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        ...candidature.instruction.formatter(),
        ...candidature.dépôt.formatter(),
        importéLe: candidature.importéLe.formatter(),
        importéPar: candidature.importéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async corriger(candidature: CorrigerCandidatureOptions) {
    this.vérifierQueLaCandidatureExiste();
    this.vérifierQueLeStatutEstModifiable(candidature);
    this.vérifierQueLeTypeDesGarantiesFinancièresEstModifiable(candidature);
    this.vérifierQueLaRégénérationDeLAttestionEstPossible(candidature);
    this.vérifierChampSupplémentaires(candidature);
    this.vérifierTechnologie(candidature);
    this.vérifierQueLaCorrectionEstJustifiée(candidature);

    if (candidature.instruction.statut.estClassé()) {
      this.projet.lauréat.garantiesFinancières.vérifierSiLesGarantiesFinancièresSontValides(
        candidature.dépôt.garantiesFinancières,
      );
    }

    const event: CandidatureCorrigéeEvent = {
      type: 'CandidatureCorrigée-V2',
      payload: {
        identifiantProjet: this.projet.identifiantProjet.formatter(),
        ...candidature.instruction.formatter(),
        ...candidature.dépôt.formatter(),
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

  private vérifierQueLeTypeDesGarantiesFinancièresEstModifiable(
    candidature: CorrigerCandidatureOptions,
  ) {
    if (this.#estNotifiée) {
      if (candidature.dépôt.garantiesFinancières) {
        if (!this.dépôt.garantiesFinancières?.estÉgaleÀ(candidature.dépôt.garantiesFinancières)) {
          throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
        }
      } else if (this.dépôt.garantiesFinancières) {
        throw new TypeGarantiesFinancièresNonModifiableAprèsNotificationError();
      }
    }
  }

  private vérifierQueLeStatutEstModifiable(candidature: CorrigerCandidatureOptions) {
    if (this.#estNotifiée && !candidature.instruction.statut.estÉgaleÀ(this.instruction.statut)) {
      throw new StatutNonModifiableAprèsNotificationError();
    }
  }

  private vérifierQueLaCorrectionEstJustifiée({ dépôt, instruction }: CorrigerCandidatureOptions) {
    if (dépôt.estÉgaleÀ(this.dépôt) && instruction.estÉgaleÀ(this.instruction)) {
      throw new CandidatureNonModifiéeError(dépôt.nomProjet);
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

  private vérifierQueLaPériodeEstValide() {
    if (this.projet.période.type === 'legacy') {
      throw new PériodeAppelOffreLegacyError(
        this.projet.identifiantProjet.appelOffre,
        this.projet.identifiantProjet.période,
      );
    }
  }

  private vérifierSiLaCandidatureADéjàÉtéImportée() {
    if (this.#dépôt) {
      throw new CandidatureDéjàImportéeError();
    }
  }

  private vérifierChampSupplémentaires({ dépôt }: CandidatureBehaviorOptions) {
    const { coefficientKChoisi, puissanceDeSite, autorisationDUrbanisme } =
      this.projet.cahierDesChargesActuel.getChampsSupplémentaires();
    if (coefficientKChoisi === 'requis' && dépôt.coefficientKChoisi === undefined) {
      throw new ChoixCoefficientKRequisError();
    }
    if (!coefficientKChoisi && dépôt.coefficientKChoisi !== undefined) {
      throw new ChoixCoefficientKNonAttenduError();
    }

    if (puissanceDeSite === 'requis' && dépôt.puissanceDeSite === undefined) {
      throw new PuissanceDeSiteRequiseError();
    }
    if (!puissanceDeSite && dépôt.puissanceDeSite !== undefined) {
      throw new PuissanceDeSiteNonAttendueError();
    }

    if (
      autorisationDUrbanisme === 'requis' &&
      (dépôt.autorisationDUrbanisme === undefined ||
        !dépôt.autorisationDUrbanisme.date ||
        !dépôt.autorisationDUrbanisme.numéro)
    ) {
      throw new AutorisationDUrbanismeRequiseError();
    }

    if (dépôt.autorisationDUrbanisme?.date.estDansLeFutur()) {
      throw new DateAutorisationDUrbanismeError();
    }
  }

  private vérifierTechnologie({ dépôt }: CandidatureBehaviorOptions) {
    if (this.projet.appelOffre.multiplesTechnologies) {
      if (dépôt.technologie.estNonApplicable()) {
        throw new TechnologieRequiseError();
      }
    } else if (
      !dépôt.technologie.estNonApplicable() &&
      !dépôt.technologie.estÉgaleÀ(
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

  private applyCommonEventPayload(
    payload:
      | CandidatureImportéeEvent['payload']
      | CandidatureCorrigéeEventV1['payload']
      | CandidatureImportéeEventV1['payload']
      | CandidatureCorrigéeEvent['payload'],
  ) {
    this.#dépôt = Dépôt.convertirEnValueType({ ...payload, fournisseurs: [] });
    this.#instruction = Instruction.convertirEnValueType(payload);
  }

  private applyFournisseurEventPayload(
    fournisseurs:
      | FournisseurImportéEvent['payload']['fournisseurs']
      | CandidatureImportéeEvent['payload']['fournisseurs'],
  ) {
    this.#dépôt = Dépôt.convertirEnValueType({
      ...this.dépôt.formatter(),
      fournisseurs,
    });
  }
}
