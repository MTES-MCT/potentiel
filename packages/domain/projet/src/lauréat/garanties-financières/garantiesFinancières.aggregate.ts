import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate';
import { TypeGarantiesFinancières } from '../../candidature';

import {
  GarantiesFinancières,
  MotifDemandeGarantiesFinancières,
  TypeTâchePlanifiéeGarantiesFinancières,
} from '.';

import {
  AttestationGarantiesFinancièresEnregistréeEvent,
  DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  DépôtGarantiesFinancièresEnCoursModifiéEvent,
  DépôtGarantiesFinancièresEnCoursSuppriméEvent,
  DépôtGarantiesFinancièresEnCoursSuppriméEventV1,
  DépôtGarantiesFinancièresEnCoursValidéEvent,
  DépôtGarantiesFinancièresEnCoursValidéEventV1,
  DépôtGarantiesFinancièresSoumisEvent,
  GarantiesFinancièresDemandéesEvent,
  GarantiesFinancièresEnregistréesEvent,
  GarantiesFinancièresEvent,
  GarantiesFinancièresModifiéesEvent,
  GarantiesFinancièresÉchuesEvent,
  HistoriqueGarantiesFinancièresEffacéEvent,
  TypeGarantiesFinancièresImportéEvent,
} from './garantiesFinancières.event';
import { DemanderOptions } from './demander/demanderGarantiesFinancières.options';
import { EffacerHistoriqueOptions } from './effacer/efffacerHistoriqueGarantiesFinancières';
import { ImporterOptions } from './importer/importerGarantiesFinancières.option';
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

export class GarantiesFinancièresAggregate extends AbstractAggregate<
  GarantiesFinancièresEvent,
  'garanties-financieres',
  LauréatAggregate
> {
  #tâchePlanifiéeEchoir!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel1mois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel2mois!: AggregateType<TâchePlanifiéeAggregate>;

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

  #dépôtEnCours: GarantiesFinancières.ValueType | undefined = undefined;
  get aUnDépôtEnCours() {
    return !!this.#dépôtEnCours;
  }

  #estLevé: boolean = false;
  get estLevé() {
    return this.#estLevé;
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
    await this.ajouterTâchesPlanifiées();
  }

  async demander({ demandéLe, motif, dateLimiteSoumission }: DemanderOptions) {
    const aDesGarantiesFinancièresEnAttente = this.#dateLimiteSoumission && this.#motifDemande;

    if (
      this.lauréat.projet.cahierDesChargesActuel.estSoumisAuxGarantiesFinancières() ||
      aDesGarantiesFinancièresEnAttente
    ) {
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
    }
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
    await this.ajouterTâchesPlanifiées();
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
    await this.ajouterTâchesPlanifiées();
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
    await this.ajouterTâchesPlanifiées();
  }

  async échoir() {
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();

    if (!this.#dateÉchéance) {
      throw new GarantiesFinancièresSansÉchéanceError();
    }

    const now = DateTime.now();
    if (!now.estUltérieureÀ(this.#dateÉchéance)) {
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
        échuLe: now.formatter(),
      },
    };

    await this.publish(event);
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
  }

  async ajouterTâchesPlanifiées() {
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
  }

  apply(event: GarantiesFinancièresEvent): void {
    match(event)
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V1',
        },
        this.applyDépôtGarantiesFinancièresEnCoursSuppriméV1.bind(this),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
        },
        this.applyDépôtGarantiesFinancièresEnCoursSuppriméV2.bind(this),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresSoumis-V1',
        },
        this.applyDépôtGarantiesFinancièresSoumisV1.bind(this),
      )
      .with(
        { type: 'DépôtGarantiesFinancièresEnCoursModifié-V1' },
        this.applyDépôtGarantiesFinancièresEnCoursModifiéV1.bind(this),
      )
      .with(
        {
          type: 'HistoriqueGarantiesFinancièresEffacé-V1',
        },
        this.applyHistoriqueGarantiesFinancièresEffacéV1.bind(this),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursValidé-V1',
        },
        this.applyDépôtGarantiesFinancièresEnCoursValidéV1.bind(this),
      )
      .with(
        {
          type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
        },
        this.applyDépôtGarantiesFinancièresEnCoursValidéV2.bind(this),
      )
      .with(
        {
          type: 'GarantiesFinancièresEnregistrées-V1',
        },
        this.applyGarantiesFinancièresEnregistréesV1.bind(this),
      )
      .with(
        {
          type: 'GarantiesFinancièresModifiées-V1',
        },
        this.applyGarantiesFinancièresModifiéesV1.bind(this),
      )
      .with(
        {
          type: 'TypeGarantiesFinancièresImporté-V1',
        },
        this.applyTypeGarantiesFinancièresImportéV1.bind(this),
      )
      .with(
        {
          type: 'GarantiesFinancièresDemandées-V1',
        },
        this.applyGarantiesFinancièresDemandéesV1.bind(this),
      )
      .with(
        { type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1' },
        this.applyDemandeMainlevéeGarantiesFinancièresAccordéeV1.bind(this),
      )
      .with(
        {
          type: 'AttestationGarantiesFinancièresEnregistrée-V1',
        },
        this.applyAttestationGarantiesFinancièresEnregistréeV1.bind(this),
      )
      .with(
        { type: 'GarantiesFinancièresÉchues-V1' },
        this.applyGarantiesFinancièresÉchuesV1.bind(this),
      )
      .otherwise(() => {});
    // Provisoire le temps de déplacer toutes la logique métier du package lauréat à celui-ci.
    // .exhaustive();
  }

  // Dépôt

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
    payload: { type, dateÉchéance },
  }: DépôtGarantiesFinancièresSoumisEvent) {
    this.#dépôtEnCours = GarantiesFinancières.convertirEnValueType({ type, dateÉchéance });
  }

  private applyDépôtGarantiesFinancièresEnCoursModifiéV1({
    payload: { type, dateÉchéance },
  }: DépôtGarantiesFinancièresEnCoursModifiéEvent) {
    this.#dépôtEnCours = GarantiesFinancières.convertirEnValueType({ type, dateÉchéance });
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1(
    _: DépôtGarantiesFinancièresEnCoursValidéEventV1,
  ) {
    this.#aDesGarantiesFinancières = true;
    this.#aUneAttestation = true;
    // l'évènement v1 ne contenait pas l'attestation, mais utilisait le dépôt en cours
    if (this.#dépôtEnCours) {
      this.#type = this.#dépôtEnCours?.type;
      if (this.#dépôtEnCours.estAvecDateÉchéance())
        this.#dateÉchéance = this.#dépôtEnCours.dateÉchéance;
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

  // Actuelles

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

  // Mainlevée

  private applyDemandeMainlevéeGarantiesFinancièresAccordéeV1(
    _: DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  ) {
    this.#estLevé = true;
  }

  private applyAttestationGarantiesFinancièresEnregistréeV1(
    _: AttestationGarantiesFinancièresEnregistréeEvent,
  ) {
    this.#aUneAttestation = true;
  }
}
