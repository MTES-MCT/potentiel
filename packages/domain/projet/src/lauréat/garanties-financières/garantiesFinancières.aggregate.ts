import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate';
import { TypeGarantiesFinancières } from '../../candidature';

import {
  GarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  StatutMainlevéeGarantiesFinancières,
  TypeTâchePlanifiéeGarantiesFinancières,
} from '.';

import { GarantiesFinancièresEvent } from './garantiesFinancières.event';
import { DemanderOptions } from './actuelles/demander/demanderGarantiesFinancières.options';
import { EffacerHistoriqueOptions } from './actuelles//effacer/efffacerHistoriqueGarantiesFinancières';
import { ImporterOptions } from './actuelles//importer/importerGarantiesFinancières.option';
import {
  AttestationDeConformitéError,
  AttestationGarantiesFinancièresDéjàExistante,
  AucunesGarantiesFinancièresActuellesError,
  ChoixExemptionImpossibleError,
  DateConstitutionDansLeFuturError,
  DateÉchéanceNonPasséeError,
  DépôtEnCoursError,
  GarantiesFinancièresDéjàEnregistréesError,
  GarantiesFinancièresDéjàLevéesError,
  GarantiesFinancièresDéjàÉchuesError,
  GarantiesFinancièresRequisesPourAppelOffreError,
  GarantiesFinancièresSansÉchéanceError,
  ProjetExemptDeGarantiesFinancièresError,
  TypeGarantiesFinancièresNonDisponiblePourAppelOffreError,
} from './garantiesFinancières.error';
import { ModifierActuellesOptions } from './actuelles/modifier/modifierGarantiesFinancières.options';
import { EnregistrerAttestationOptions } from './actuelles/enregistrerAttestation/enregistrerAttestationGarantiesFinancières.options';
import { EnregisterOptions } from './actuelles/enregistrer/enregisterGarantiesFinancières.options';
import { ÉchoirOptions } from './actuelles/échoir/échoirGarantiesFinancières.options';
import { SoumettreDépôtOptions } from './dépôt/soumettre/soumettreDépôtGarantiesFinancières.options';
import {
  AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError,
  DemandeMainlevéeDemandéeError,
  DemandeMainlevéeEnInstructionError,
  DépôtGarantiesFinancièresDéjàSoumisError,
} from './dépôt/depôtGarantiesFinancières.error';
import {
  TypeGarantiesFinancièresImportéEvent,
  GarantiesFinancièresDemandéesEvent,
  GarantiesFinancièresModifiéesEvent,
  AttestationGarantiesFinancièresEnregistréeEvent,
  GarantiesFinancièresEnregistréesEvent,
  GarantiesFinancièresÉchuesEvent,
  HistoriqueGarantiesFinancièresEffacéEvent,
} from './actuelles/garantiesFinancièresActuelles.event';
import {
  DépôtGarantiesFinancièresSoumisEvent,
  DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
  DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  DépôtGarantiesFinancièresEnCoursModifiéEvent,
  DépôtGarantiesFinancièresEnCoursValidéEventV1,
  DépôtGarantiesFinancièresEnCoursValidéEvent,
} from './dépôt/depôtGarantiesFinancières.event';
import {
  DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  MainlevéeGarantiesFinancièresDemandéeEvent,
  InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
  DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
  DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
} from './mainlevée/mainlevéeGarantiesFinancières.event';
import { ValiderDépôtOptions } from './dépôt/valider/validerDépôtGarantiesFinancières.option';
import { ModifierDépôtOptions } from './dépôt/modifier/modifierDépôtGarantiesFinancières.option';

export class GarantiesFinancièresAggregate extends AbstractAggregate<
  GarantiesFinancièresEvent,
  'garanties-financieres',
  LauréatAggregate
> {
  #tâchePlanifiéeEchoir!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel1mois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel2mois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelEnAttente!: AggregateType<TâchePlanifiéeAggregate>;

  #type!: TypeGarantiesFinancières.ValueType;
  #dateÉchéance: DateTime.ValueType | undefined;
  #motifDemande: MotifDemandeGarantiesFinancières.ValueType | undefined;
  #dateLimiteSoumission: DateTime.ValueType | undefined;

  async init() {
    this.#tâchePlanifiéeEchoir = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
    );
    this.#tâchePlanifiéeRappel1mois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
    );
    this.#tâchePlanifiéeRappel2mois = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
    );
    this.#tâchePlanifiéeRappelEnAttente = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeGarantiesFinancières.rappelEnAttente.type,
    );
  }

  get lauréat() {
    return this.parent;
  }

  get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  #aDesGarantiesFinancières: boolean = false;
  get aDesGarantiesFinancières() {
    return this.#aDesGarantiesFinancières;
  }

  #dépôtEnCours:
    | {
        soumisLe: DateTime.ValueType;
        dateConstitution: DateTime.ValueType;
        attestation: { format: string };
        garantiesFinancières: GarantiesFinancières.ValueType;
      }
    | undefined = undefined;
  get aUnDépôtEnCours() {
    return !!this.#dépôtEnCours;
  }

  #statutMainlevée: StatutMainlevéeGarantiesFinancières.ValueType | undefined = undefined;

  get estLevé() {
    return this.#statutMainlevée?.estAccordé();
  }

  #estÉchu: boolean = false;
  get estÉchu() {
    return this.#estÉchu;
  }

  #aUneAttestation: boolean = false;
  get aUneAttestation() {
    return this.#aUneAttestation;
  }

  vérifierSiLesGarantiesFinancièresSontValides(
    garantiesFinancières: GarantiesFinancières.ValueType | undefined,
  ) {
    this.vérifierSiLesGarantiesFinancièresSontRequises(garantiesFinancières?.type);
    this.vérifierSiLeTypeEstDisponiblePourAppelOffre(garantiesFinancières?.type);
  }

  private vérifierQueLaDateDeConstitutionEstValide(dateConstitution: DateTime.ValueType) {
    if (dateConstitution.estDansLeFutur()) {
      throw new DateConstitutionDansLeFuturError();
    }
  }

  private vérifierSiLeTypeEstDisponiblePourAppelOffre(
    type: TypeGarantiesFinancières.ValueType | undefined,
  ) {
    const typesDisponibles =
      this.lauréat.projet.appelOffre.garantiesFinancières.typeGarantiesFinancièresDisponibles;
    if (type && !typesDisponibles.includes(type.type)) {
      throw new TypeGarantiesFinancièresNonDisponiblePourAppelOffreError();
    }
  }

  private vérifierSiLesGarantiesFinancièresSontRequises(
    type: TypeGarantiesFinancières.ValueType | undefined,
  ) {
    if (!type && this.lauréat.projet.cahierDesChargesActuel.estSoumisAuxGarantiesFinancières()) {
      throw new GarantiesFinancièresRequisesPourAppelOffreError();
    }
  }

  private vérifierQueLesGarantiesFinancièresSontModifiables() {
    if (this.#type?.estExemption()) {
      throw new ProjetExemptDeGarantiesFinancièresError();
    }
  }

  private vérifierSiLesGarantiesFinancièresSontLevées() {
    if (this.estLevé) {
      throw new GarantiesFinancièresDéjàLevéesError();
    }
  }

  private vérifierQueLesGarantiesFinancièresActuellesExistent() {
    if (!this.aDesGarantiesFinancières) {
      throw new AucunesGarantiesFinancièresActuellesError();
    }
  }

  private vérifierQuUnDépôtEstEnCours() {
    if (!this.#dépôtEnCours) {
      throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
    }
  }

  //#region Behavior Actuelles

  async importer({ importéLe, garantiesFinancières }: ImporterOptions) {
    if (!garantiesFinancières) {
      return;
    }
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);

    const event: TypeGarantiesFinancièresImportéEvent = {
      type: 'TypeGarantiesFinancièresImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        importéLe: importéLe.formatter(),
        ...garantiesFinancières.formatter(),
      },
    };
    await this.publish(event);
    await this.ajouterTâchesPlanifiéesÉchéance();
  }

  async demander({ demandéLe, motif, dateLimiteSoumission }: DemanderOptions) {
    const event: GarantiesFinancièresDemandéesEvent = {
      type: 'GarantiesFinancièresDemandées-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateLimiteSoumission: dateLimiteSoumission.formatter(),
        demandéLe: demandéLe.formatter(),
        motif: motif.motif,
      },
    };
    await this.publish(event);

    await this.#tâchePlanifiéeRappelEnAttente.ajouter({
      àExécuterLe: demandéLe.ajouterNombreDeMois(1),
    });
  }

  // TODO cette fonction sera à déplacer dans supprimerDépôt
  async redemander(demandéLe: DateTime.ValueType) {
    if (this.#dateLimiteSoumission && this.#motifDemande) {
      await this.demander({
        demandéLe,
        dateLimiteSoumission: this.#dateLimiteSoumission,
        motif: this.#motifDemande,
      });
    }
    // Un dépôt de GF annule les tâches planifiées, donc on doit les recréer si le dépôt est supprimé.
    await this.ajouterTâchesPlanifiéesÉchéance();
  }

  async modifier({
    attestation,
    dateConstitution,
    garantiesFinancières,
    modifiéLe,
    modifiéPar,
  }: ModifierActuellesOptions) {
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);
    this.vérifierQueLesGarantiesFinancièresSontModifiables();
    this.vérifierQueLaDateDeConstitutionEstValide(dateConstitution);
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();
    this.vérifierSiLesGarantiesFinancièresSontLevées();

    const event: GarantiesFinancièresModifiéesEvent = {
      type: 'GarantiesFinancièresModifiées-V1',
      payload: {
        attestation: { format: attestation.format },
        dateConstitution: dateConstitution.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        ...garantiesFinancières.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };

    await this.publish(event);
    await this.ajouterTâchesPlanifiéesÉchéance();
  }

  async enregistrerAttestation({
    attestation,
    dateConstitution,
    enregistréLe,
    enregistréPar,
  }: EnregistrerAttestationOptions) {
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();
    if (this.aUneAttestation) {
      throw new AttestationGarantiesFinancièresDéjàExistante();
    }
    this.vérifierQueLaDateDeConstitutionEstValide(dateConstitution);

    const event: AttestationGarantiesFinancièresEnregistréeEvent = {
      type: 'AttestationGarantiesFinancièresEnregistrée-V1',
      payload: {
        attestation: { format: attestation.format },
        dateConstitution: dateConstitution.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        enregistréLe: enregistréLe.formatter(),
        enregistréPar: enregistréPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async enregistrer({
    attestation,
    dateConstitution,
    garantiesFinancières,
    enregistréLe,
    enregistréPar,
  }: EnregisterOptions) {
    if (this.aDesGarantiesFinancières) {
      throw new GarantiesFinancièresDéjàEnregistréesError();
    }
    this.vérifierQueLaDateDeConstitutionEstValide(dateConstitution);
    if (garantiesFinancières.estExemption()) {
      throw new ChoixExemptionImpossibleError();
    }

    const event: GarantiesFinancièresEnregistréesEvent = {
      type: 'GarantiesFinancièresEnregistrées-V1',
      payload: {
        attestation: { format: attestation.format },
        dateConstitution: dateConstitution.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        ...garantiesFinancières.formatter(),
        enregistréLe: enregistréLe.formatter(),
        enregistréPar: enregistréPar.formatter(),
      },
    };

    await this.publish(event);
    await this.ajouterTâchesPlanifiéesÉchéance();
    await this.#tâchePlanifiéeRappelEnAttente.annuler();
  }

  async échoir({ échuLe }: ÉchoirOptions) {
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();

    if (!this.#dateÉchéance) {
      throw new GarantiesFinancièresSansÉchéanceError();
    }

    if (échuLe.estAntérieurÀ(this.#dateÉchéance)) {
      throw new DateÉchéanceNonPasséeError();
    }

    if (this.#estÉchu) {
      throw new GarantiesFinancièresDéjàÉchuesError();
    }

    if (this.aUnDépôtEnCours) {
      throw new DépôtEnCoursError();
    }

    if (this.lauréat.achèvement.estAchevé) {
      throw new AttestationDeConformitéError();
    }

    const event: GarantiesFinancièresÉchuesEvent = {
      type: 'GarantiesFinancièresÉchues-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateÉchéance: this.#dateÉchéance.formatter(),
        échuLe: échuLe.formatter(),
      },
    };

    await this.publish(event);

    await this.demander({
      demandéLe: échuLe,
      dateLimiteSoumission: échuLe.ajouterNombreDeMois(2),
      motif: MotifDemandeGarantiesFinancières.échéanceGarantiesFinancièresActuelles,
    });
  }

  async effacerHistorique({ effacéLe, effacéPar }: EffacerHistoriqueOptions) {
    if (this.aDesGarantiesFinancières || this.aUnDépôtEnCours) {
      const event: HistoriqueGarantiesFinancièresEffacéEvent = {
        type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          effacéLe: effacéLe.formatter(),
          effacéPar: effacéPar.formatter(),
        },
      };

      await this.publish(event);
    }

    await this.annulerTâchesPlanififées();
  }

  //#endregion Behavior Actuelles

  //#region Behavior Dépôt
  async soumettreDépôt({
    attestation,
    dateConstitution,
    soumisLe,
    soumisPar,
    garantiesFinancières,
  }: SoumettreDépôtOptions) {
    if (this.#dépôtEnCours) {
      throw new DépôtGarantiesFinancièresDéjàSoumisError();
    }
    if (dateConstitution.estDansLeFutur()) {
      throw new DateConstitutionDansLeFuturError();
    }

    if (this.#statutMainlevée?.estDemandé()) {
      throw new DemandeMainlevéeDemandéeError();
    }
    if (this.#statutMainlevée?.estEnInstruction()) {
      throw new DemandeMainlevéeEnInstructionError();
    }
    if (this.estLevé) {
      throw new GarantiesFinancièresDéjàLevéesError();
    }

    const event: DépôtGarantiesFinancièresSoumisEvent = {
      type: 'DépôtGarantiesFinancièresSoumis-V1',
      payload: {
        attestation: { format: attestation.format },
        dateConstitution: dateConstitution.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        soumisLe: soumisLe.formatter(),
        soumisPar: soumisPar.formatter(),
        ...garantiesFinancières.formatter(),
      },
    };

    await this.publish(event);

    await this.annulerTâchesPlanififées();
  }

  async modifierDépôt({
    attestation,
    dateConstitution,
    modifiéLe,
    garantiesFinancières,
    modifiéPar,
  }: ModifierDépôtOptions) {
    this.vérifierQuUnDépôtEstEnCours();
    if (dateConstitution.estDansLeFutur()) {
      throw new DateConstitutionDansLeFuturError();
    }

    const event: DépôtGarantiesFinancièresEnCoursModifiéEvent = {
      type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
      payload: {
        attestation: { format: attestation.format },
        dateConstitution: dateConstitution.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        ...garantiesFinancières.formatter(),
      },
    };

    await this.publish(event);
  }

  async validerDépôt({ validéLe, validéPar }: ValiderDépôtOptions) {
    if (!this.#dépôtEnCours) {
      throw new AucunDépôtEnCoursGarantiesFinancièresPourLeProjetError();
    }
    const { dateConstitution, attestation, garantiesFinancières, soumisLe } = this.#dépôtEnCours;

    const event: DépôtGarantiesFinancièresEnCoursValidéEvent = {
      type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateConstitution: dateConstitution.formatter(),
        soumisLe: soumisLe.formatter(),
        attestation,
        validéLe: validéLe.formatter(),
        validéPar: validéPar.formatter(),
        ...garantiesFinancières.formatter(),
      },
    };

    await this.publish(event);
    await this.ajouterTâchesPlanifiéesÉchéance();
  }

  // async supprimerDépôt() {}

  //#endregion Behavior Dépôt
  async ajouterTâchesPlanifiéesÉchéance() {
    if (this.#dateÉchéance && !this.lauréat.projet.statut.estAchevé()) {
      await this.#tâchePlanifiéeEchoir.ajouter({
        àExécuterLe: this.#dateÉchéance.ajouterNombreDeJours(1),
      });

      await this.#tâchePlanifiéeRappel1mois.ajouter({
        àExécuterLe: this.#dateÉchéance.retirerNombreDeMois(1),
      });

      await this.#tâchePlanifiéeRappel2mois.ajouter({
        àExécuterLe: this.#dateÉchéance.retirerNombreDeMois(2),
      });
    }
  }

  async annulerTâchesPlanififées() {
    await this.#tâchePlanifiéeEchoir.annuler();
    await this.#tâchePlanifiéeRappel1mois.annuler();
    await this.#tâchePlanifiéeRappel2mois.annuler();
    await this.#tâchePlanifiéeRappelEnAttente.annuler();
  }

  apply(event: GarantiesFinancièresEvent): void {
    match(event)
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1' },
        this.applyDépôtGarantiesFinancièresEnCoursSuppriméV1.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2' },
        this.applyDépôtGarantiesFinancièresEnCoursSuppriméV2.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresSoumis-V1' },
        this.applyDépôtGarantiesFinancièresSoumisV1.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursModifié-V1' },
        this.applyDépôtGarantiesFinancièresEnCoursModifiéV1.bind(this),
      )
      .with(
        { type: 'HistoriqueGarantiesFinancièresEffacé-V1' },
        this.applyHistoriqueGarantiesFinancièresEffacéV1.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' },
        this.applyDépôtGarantiesFinancièresEnCoursValidéV1.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' },
        this.applyDépôtGarantiesFinancièresEnCoursValidéV2.bind(this),
      )
      .with(
        { type: 'GarantiesFinancièresEnregistrées-V1' },
        this.applyGarantiesFinancièresEnregistréesV1.bind(this),
      )
      .with(
        { type: 'GarantiesFinancièresModifiées-V1' },
        this.applyGarantiesFinancièresModifiéesV1.bind(this),
      )
      .with(
        { type: 'TypeGarantiesFinancièresImporté-V1' },
        this.applyTypeGarantiesFinancièresImportéV1.bind(this),
      )
      .with(
        { type: 'GarantiesFinancièresDemandées-V1' },
        this.applyGarantiesFinancièresDemandéesV1.bind(this),
      )
      .with(
        { type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1' },
        this.applyDemandeMainlevéeGarantiesFinancièresAccordéeV1.bind(this),
      )
      .with(
        { type: 'MainlevéeGarantiesFinancièresDemandée-V1' },
        this.applyMainlevéeGarantiesFinancièresDemandéeV1.bind(this),
      )
      .with(
        { type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1' },
        this.applyInstructionDemandeMainlevéeGarantiesFinancièresDémarréeV1.bind(this),
      )
      .with(
        { type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1' },
        this.applyDemandeMainlevéeGarantiesFinancièresAnnuléeV1.bind(this),
      )
      .with(
        { type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1' },
        this.applyDemandeMainlevéeGarantiesFinancièresRejetéeV1.bind(this),
      )
      .with(
        { type: 'AttestationGarantiesFinancièresEnregistrée-V1' },
        this.applyAttestationGarantiesFinancièresEnregistréeV1.bind(this),
      )
      .with(
        { type: 'GarantiesFinancièresÉchues-V1' },
        this.applyGarantiesFinancièresÉchuesV1.bind(this),
      )
      .exhaustive();
  }

  //#region Apply Dépôt

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV1(
    _: DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
  ) {
    this.#dépôtEnCours = undefined;
  }

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV2(
    _: DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  ) {
    this.#dépôtEnCours = undefined;
  }

  private applyDépôtGarantiesFinancièresSoumisV1({
    payload: { type, dateÉchéance, attestation, dateConstitution, soumisLe },
  }: DépôtGarantiesFinancièresSoumisEvent) {
    this.#dépôtEnCours = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({ type, dateÉchéance }),
      soumisLe: DateTime.convertirEnValueType(soumisLe),
      dateConstitution: DateTime.convertirEnValueType(dateConstitution),
      attestation: { format: attestation.format },
    };
  }

  private applyDépôtGarantiesFinancièresEnCoursModifiéV1({
    payload: { type, dateÉchéance, attestation, dateConstitution, modifiéLe },
  }: DépôtGarantiesFinancièresEnCoursModifiéEvent) {
    this.#dépôtEnCours = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({ type, dateÉchéance }),
      soumisLe: DateTime.convertirEnValueType(modifiéLe),
      dateConstitution: DateTime.convertirEnValueType(dateConstitution),
      attestation: { format: attestation.format },
    };
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1(
    _: DépôtGarantiesFinancièresEnCoursValidéEventV1,
  ) {
    this.#aDesGarantiesFinancières = true;
    this.#aUneAttestation = true;
    // l'évènement v1 ne contenait pas l'attestation, mais utilisait le dépôt en cours
    if (this.#dépôtEnCours) {
      this.#type = this.#dépôtEnCours.garantiesFinancières.type;
      if (this.#dépôtEnCours.garantiesFinancières.estAvecDateÉchéance())
        this.#dateÉchéance = this.#dépôtEnCours.garantiesFinancières.dateÉchéance;
    }
    this.#dépôtEnCours = undefined;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV2({
    payload: { dateÉchéance, type },
  }: DépôtGarantiesFinancièresEnCoursValidéEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#aUneAttestation = true;
    this.#dépôtEnCours = undefined;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  //#endregion Apply Dépôt

  //#region Apply Actuelles

  private applyGarantiesFinancièresEnregistréesV1({
    payload: { dateÉchéance, type },
  }: GarantiesFinancièresEnregistréesEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#aUneAttestation = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyGarantiesFinancièresModifiéesV1({
    payload: { type, dateÉchéance },
  }: GarantiesFinancièresModifiéesEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#aUneAttestation = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyHistoriqueGarantiesFinancièresEffacéV1(
    _: HistoriqueGarantiesFinancièresEffacéEvent,
  ) {
    this.#aDesGarantiesFinancières = false;
    this.#dépôtEnCours = undefined;
  }

  private applyTypeGarantiesFinancièresImportéV1({
    payload: { type, dateÉchéance },
  }: TypeGarantiesFinancièresImportéEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyGarantiesFinancièresDemandéesV1({
    payload: { motif, dateLimiteSoumission },
  }: GarantiesFinancièresDemandéesEvent) {
    this.#motifDemande = MotifDemandeGarantiesFinancières.convertirEnValueType(motif);
    this.#dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumission);
  }

  private applyGarantiesFinancièresÉchuesV1(_: GarantiesFinancièresÉchuesEvent) {
    this.#estÉchu = true;
  }

  private applyAttestationGarantiesFinancièresEnregistréeV1(
    _: AttestationGarantiesFinancièresEnregistréeEvent,
  ) {
    this.#aUneAttestation = true;
  }
  //#endregion Apply GF Actuelles

  //#region Apply Mainlevée

  private applyDemandeMainlevéeGarantiesFinancièresAccordéeV1(
    _: DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.accordé;
  }

  private applyMainlevéeGarantiesFinancièresDemandéeV1(
    _: MainlevéeGarantiesFinancièresDemandéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.demandé;
  }

  private applyInstructionDemandeMainlevéeGarantiesFinancièresDémarréeV1(
    _: InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.enInstruction;
  }

  private applyDemandeMainlevéeGarantiesFinancièresAnnuléeV1(
    _: DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
  ) {
    this.#statutMainlevée = undefined;
  }

  private applyDemandeMainlevéeGarantiesFinancièresRejetéeV1(
    _: DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.rejeté;
  }

  //#endregion Apply Mainlevée
}
