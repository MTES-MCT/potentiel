import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate';
import { TypeGarantiesFinancières } from '../../candidature';

import { MotifDemandeGarantiesFinancières, TypeTâchePlanifiéeGarantiesFinancières } from '.';

import {
  DépôtGarantiesFinancièresEnCoursValidéEvent,
  GarantiesFinancièresDemandéesEvent,
  GarantiesFinancièresEnregistréesEvent,
  GarantiesFinancièresEvent,
  GarantiesFinancièresModifiéesEvent,
  HistoriqueGarantiesFinancièresEffacéEvent,
  TypeGarantiesFinancièresImportéEvent,
} from './garantiesFinancières.event';
import { DemanderOptions } from './demander/demanderGarantiesFinancières.options';
import { EffacerHistoriqueOptions } from './effacer/efffacerHistoriqueGarantiesFinancières';
import { ImporterOptions } from './importer/importerGarantiesFinancières.option';
import { TypeGarantiesFinancièresNonDisponiblePourAppelOffreError } from './garantiesFinancières.error';

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

  #aUnDépôtEnCours: boolean = false;
  get aUnDépôtEnCours() {
    return this.#aUnDépôtEnCours;
  }

  estUnTypeDisponiblePourCetAppelOffre = ({
    typesDeAppelOffre,
  }: {
    typesDeAppelOffre: Array<AppelOffre.TypeGarantiesFinancières>;
  }) => {
    if (!typesDeAppelOffre.includes(this.#type.type)) {
      throw new TypeGarantiesFinancièresNonDisponiblePourAppelOffreError(this.#type.type);
    }
  };

  async importer({ type, importéLe, dateÉchéance }: ImporterOptions) {
    if (!type) {
      return;
    }

    const event: TypeGarantiesFinancièresImportéEvent = {
      type: 'TypeGarantiesFinancièresImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        type: type.type,
        dateÉchéance: dateÉchéance?.formatter(),
        importéLe: importéLe.formatter(),
      },
    };
    await this.publish(event);
    await this.ajouterTâchesPlanifiées();
  }

  async demander({ demandéLe, motif, dateLimiteSoumission }: DemanderOptions) {
    if (this.estSoumisAuxGarantiesFinancières()) {
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

  estSoumisAuxGarantiesFinancières() {
    const { appelOffre, famille } = this.lauréat.projet;
    return (
      famille?.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis' ||
      appelOffre.garantiesFinancières.soumisAuxGarantiesFinancieres !== 'non soumis'
    );
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
        this.applyGarantiesFinancièresDemandées.bind(this),
      )
      .otherwise(() => {});
    // Provisoire le temps de déplacer toutes la logique métier du package lauréat à celui-ci.
    // .exhaustive();
  }

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV1() {
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresEnCoursSuppriméV2() {
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresSoumisV1() {
    this.#aUnDépôtEnCours = true;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1() {
    this.#aDesGarantiesFinancières = true;
    this.#aUnDépôtEnCours = false;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV2({
    payload: { dateÉchéance, type },
  }: DépôtGarantiesFinancièresEnCoursValidéEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#aUnDépôtEnCours = false;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyGarantiesFinancièresEnregistréesV1({
    payload: { dateÉchéance, type },
  }: GarantiesFinancièresEnregistréesEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyGarantiesFinancièresModifiéesV1({
    payload: { type, dateÉchéance },
  }: GarantiesFinancièresModifiéesEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyHistoriqueGarantiesFinancièresEffacéV1() {
    this.#aDesGarantiesFinancières = false;
    this.#aUnDépôtEnCours = false;
  }

  private applyTypeGarantiesFinancièresImportéV1({
    payload: { type, dateÉchéance },
  }: TypeGarantiesFinancièresImportéEvent) {
    this.#aDesGarantiesFinancières = true;
    this.#type = TypeGarantiesFinancières.convertirEnValueType(type);
    this.#dateÉchéance = dateÉchéance ? DateTime.convertirEnValueType(dateÉchéance) : undefined;
  }

  private applyGarantiesFinancièresDemandées({
    payload: { motif, dateLimiteSoumission },
  }: GarantiesFinancièresDemandéesEvent) {
    this.#motifDemande = MotifDemandeGarantiesFinancières.convertirEnValueType(motif);
    this.#dateLimiteSoumission = DateTime.convertirEnValueType(dateLimiteSoumission);
  }
}
