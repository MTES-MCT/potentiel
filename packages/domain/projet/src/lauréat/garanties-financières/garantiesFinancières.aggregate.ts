import { match } from 'ts-pattern';

import { AbstractAggregate, AggregateType } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';

import { LauréatAggregate } from '../lauréat.aggregate';
import { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate';
import { TypeGarantiesFinancières } from '../../candidature';
import { TâcheAggregate } from '../tâche/tâche.aggregate';
import { TypeTâche } from '../tâche';

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
  AttestationEtDateGarantiesFinancièresRequisesError,
  AttestationGarantiesFinancièresDéjàExistanteError,
  AucunesGarantiesFinancièresActuellesError,
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
  AucunDépôtDeGarantiesFinancièresEnCoursPourLeProjetError,
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
import { SupprimerDépôtOptions } from './dépôt/supprimer/supprimerDépôtGarantiesFinancières.option';
import { DemanderMainlevéeOptions } from './mainlevée/demander/demanderMainlevéeGarantiesFinancières.options';
import {
  DépôtDeGarantiesFinancièresÀSupprimerError,
  MainlevéeDéjàAccordéeError,
  MainlevéeDéjàEnInstructionError,
  MainlevéeDéjàRejetéeError,
  MainlevéeNonTrouvéeError,
  ProjetNonAbandonnéError,
  ProjetNonAchevéError,
} from './mainlevée/mainlevéeGarantiesFinancières.error';
import { AnnulerMainlevéeOption } from './mainlevée/annuler/annulerMainlevéeGarantiesFinancières.options';
import { DémarrerInstructionMainlevéeOptions } from './mainlevée/démarrerInstruction/démarrerInstructionMainlevée.options';
import { AccorderMainlevéeOptions } from './mainlevée/accorder/accorderMainlevéeGarantiesFinancières.options';
import { RejeterMainlevéeOptions } from './mainlevée/rejeter/rejeterMainlevéeGarantiesFinancières.options';

type GarantiesFinancièresActuelles = {
  garantiesFinancières: GarantiesFinancières.ValueType;
};

type DépôtGarantiesFinancières = {
  soumisLe: DateTime.ValueType;
  garantiesFinancières: GarantiesFinancières.ValueType;
};

export class GarantiesFinancièresAggregate extends AbstractAggregate<
  GarantiesFinancièresEvent,
  'garanties-financieres',
  LauréatAggregate
> {
  // Tâches planifiées
  #tâchePlanifiéeEchoir!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel1mois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappel2mois!: AggregateType<TâchePlanifiéeAggregate>;
  #tâchePlanifiéeRappelEnAttente!: AggregateType<TâchePlanifiéeAggregate>;

  // Tâches porteur
  #tâcheDemanderGarantiesFinancières!: AggregateType<TâcheAggregate>;

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

    this.#tâcheDemanderGarantiesFinancières = await this.lauréat.loadTâche(
      TypeTâche.garantiesFinancièresDemander.type,
    );
  }

  get lauréat() {
    return this.parent;
  }

  get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }
  get type() {
    return this.#actuelles?.garantiesFinancières.type;
  }
  get dateÉchéance() {
    return this.#actuelles?.garantiesFinancières.estAvecDateÉchéance()
      ? this.#actuelles.garantiesFinancières.dateÉchéance
      : undefined;
  }

  #dépôtEnCours: DépôtGarantiesFinancières | undefined = undefined;
  get aUnDépôtEnCours() {
    return !!this.#dépôtEnCours;
  }

  #actuelles: GarantiesFinancièresActuelles | undefined = undefined;
  get aDesGarantiesFinancières() {
    return !!this.#actuelles;
  }

  #statutMainlevée: StatutMainlevéeGarantiesFinancières.ValueType | undefined = undefined;

  get estLevé() {
    return this.#statutMainlevée?.estAccordé();
  }

  #estÉchu: boolean = false;
  get estÉchu() {
    return this.#estÉchu;
  }

  get aUneAttestation() {
    return !!this.#actuelles?.garantiesFinancières.estConstitué();
  }

  //#region Utilitaires
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

  private vérifierQueLeProjetNEstPasExempt() {
    if (this.type?.estExemption()) {
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

  private vérifierQueLesGarantiesFinancièresSontConstituées(
    garantiesFinancières: GarantiesFinancières.ValueType,
  ) {
    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
  }

  private vérifierQuUnDépôtEstEnCours() {
    if (!this.#dépôtEnCours) {
      throw new AucunDépôtDeGarantiesFinancièresEnCoursPourLeProjetError();
    }
  }

  private async planifierÉchéance(échuLe: DateTime.ValueType) {
    const garantiesFinancières = this.#actuelles?.garantiesFinancières;
    if (!garantiesFinancières?.estAvecDateÉchéance() || this.lauréat.projet.statut.estAchevé()) {
      return;
    }

    if (garantiesFinancières.dateÉchéance.estDansLeFutur()) {
      await this.#tâchePlanifiéeEchoir.ajouter({
        àExécuterLe: garantiesFinancières.dateÉchéance.ajouterNombreDeJours(1),
      });

      await this.#tâchePlanifiéeRappel1mois.ajouter({
        àExécuterLe: garantiesFinancières.dateÉchéance.retirerNombreDeMois(1),
      });

      await this.#tâchePlanifiéeRappel2mois.ajouter({
        àExécuterLe: garantiesFinancières.dateÉchéance.retirerNombreDeMois(2),
      });
    } else if (!this.estÉchu) {
      // TODO: Délai pour s'assurer que les projecteurs s'exécutent dans le bon ordre
      // Idéalement les projecteurs devrait s'éxécuter dans l'ordre des versions du stream
      await new Promise((r) => setTimeout(r, 100));
      await this.échoir({ échuLe });
    }
  }

  async annulerTâchesPlanififées() {
    await this.#tâchePlanifiéeEchoir.annuler();
    await this.#tâchePlanifiéeRappel1mois.annuler();
    await this.#tâchePlanifiéeRappel2mois.annuler();
    await this.#tâchePlanifiéeRappelEnAttente.annuler();
  }
  //#endregion Utilitaires

  //#region Behavior Actuelles
  // TODO : ajouter cas importer GF complètes
  async importerType({ importéLe, garantiesFinancières }: ImporterOptions) {
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);
    if (garantiesFinancières.constitution?.date) {
      this.vérifierQueLaDateDeConstitutionEstValide(garantiesFinancières.constitution.date);
    }

    const event: TypeGarantiesFinancièresImportéEvent = {
      type: 'TypeGarantiesFinancièresImporté-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        importéLe: importéLe.formatter(),
        ...garantiesFinancières.formatter(),
      },
    };
    await this.publish(event);
    await this.planifierÉchéance(importéLe);
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

    await this.#tâcheDemanderGarantiesFinancières.ajouter();
  }

  async modifier({ garantiesFinancières, modifiéLe, modifiéPar }: ModifierActuellesOptions) {
    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();
    this.vérifierSiLesGarantiesFinancièresSontLevées();

    const event: GarantiesFinancièresModifiéesEvent = {
      type: 'GarantiesFinancièresModifiées-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        ...garantiesFinancières.formatter(),
        attestation: { format: garantiesFinancières.constitution.attestation.format },
        dateConstitution: garantiesFinancières.constitution.date.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };

    await this.publish(event);
    await this.planifierÉchéance(modifiéLe);
  }

  async enregistrerAttestation({
    attestation,
    dateConstitution,
    enregistréLe,
    enregistréPar,
  }: EnregistrerAttestationOptions) {
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();
    if (this.aUneAttestation) {
      throw new AttestationGarantiesFinancièresDéjàExistanteError();
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

  async enregistrer({ garantiesFinancières, enregistréLe, enregistréPar }: EnregisterOptions) {
    if (this.aDesGarantiesFinancières) {
      throw new GarantiesFinancièresDéjàEnregistréesError();
    }
    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);

    const event: GarantiesFinancièresEnregistréesEvent = {
      type: 'GarantiesFinancièresEnregistrées-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        ...garantiesFinancières.formatter(),
        attestation: { format: garantiesFinancières.constitution.attestation.format },
        dateConstitution: garantiesFinancières.constitution.date.formatter(),
        enregistréLe: enregistréLe.formatter(),
        enregistréPar: enregistréPar.formatter(),
      },
    };

    await this.publish(event);
    await this.#tâchePlanifiéeRappelEnAttente.annuler();
    await this.planifierÉchéance(enregistréLe);

    await this.#tâcheDemanderGarantiesFinancières.achever();
  }

  async échoir({ échuLe }: ÉchoirOptions) {
    this.vérifierQueLesGarantiesFinancièresActuellesExistent();

    if (!this.dateÉchéance) {
      throw new GarantiesFinancièresSansÉchéanceError();
    }

    if (échuLe.estAntérieurÀ(this.dateÉchéance)) {
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
        dateÉchéance: this.dateÉchéance.formatter(),
        échuLe: échuLe.formatter(),
      },
    };

    await this.publish(event);

    await this.demander({
      demandéLe: échuLe,
      dateLimiteSoumission: échuLe.ajouterNombreDeMois(2),
      motif: MotifDemandeGarantiesFinancières.échéanceGarantiesFinancièresActuelles,
    });

    await this.#tâcheDemanderGarantiesFinancières.ajouter();
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
  async soumettreDépôt({ soumisLe, soumisPar, garantiesFinancières }: SoumettreDépôtOptions) {
    if (this.#dépôtEnCours) {
      throw new DépôtGarantiesFinancièresDéjàSoumisError();
    }
    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
    this.vérifierQueLaDateDeConstitutionEstValide(garantiesFinancières.constitution.date);
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);
    this.vérifierQueLeProjetNEstPasExempt();

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
        type: garantiesFinancières.type.formatter(),
        attestation: garantiesFinancières.constitution.attestation,
        dateConstitution: garantiesFinancières.constitution.date.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        soumisLe: soumisLe.formatter(),
        soumisPar: soumisPar.formatter(),
      },
    };

    await this.publish(event);

    await this.annulerTâchesPlanififées();

    await this.#tâcheDemanderGarantiesFinancières.achever();
  }

  async modifierDépôt({ modifiéLe, garantiesFinancières, modifiéPar }: ModifierDépôtOptions) {
    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
    this.vérifierQuUnDépôtEstEnCours();
    this.vérifierQueLaDateDeConstitutionEstValide(garantiesFinancières.constitution.date);
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);

    const event: DépôtGarantiesFinancièresEnCoursModifiéEvent = {
      type: 'DépôtGarantiesFinancièresEnCoursModifié-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        ...garantiesFinancières.formatter(),
        attestation: { format: garantiesFinancières.constitution.attestation.format },
        dateConstitution: garantiesFinancières.constitution.date.formatter(),
      },
    };

    await this.publish(event);
  }

  async validerDépôt({ validéLe, validéPar }: ValiderDépôtOptions) {
    if (!this.#dépôtEnCours) {
      throw new AucunDépôtDeGarantiesFinancièresEnCoursPourLeProjetError();
    }
    const { garantiesFinancières, soumisLe } = this.#dépôtEnCours;

    if (!garantiesFinancières.estConstitué()) {
      throw new AttestationEtDateGarantiesFinancièresRequisesError();
    }
    this.vérifierQueLaDateDeConstitutionEstValide(garantiesFinancières.constitution.date);
    this.vérifierSiLesGarantiesFinancièresSontValides(garantiesFinancières);

    const event: DépôtGarantiesFinancièresEnCoursValidéEvent = {
      type: 'DépôtGarantiesFinancièresEnCoursValidé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        soumisLe: soumisLe.formatter(),
        validéLe: validéLe.formatter(),
        validéPar: validéPar.formatter(),
        ...garantiesFinancières.formatter(),
        attestation: garantiesFinancières.constitution.attestation,
        dateConstitution: garantiesFinancières.constitution.date.formatter(),
      },
    };

    await this.publish(event);
    await this.planifierÉchéance(validéLe);
  }

  async supprimerDépôt({ suppriméLe, suppriméPar }: SupprimerDépôtOptions) {
    this.vérifierQuUnDépôtEstEnCours();

    const event: DépôtGarantiesFinancièresEnCoursSuppriméEvent = {
      type: 'DépôtGarantiesFinancièresEnCoursSupprimé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        suppriméLe: suppriméLe.formatter(),
        suppriméPar: suppriméPar.formatter(),
        garantiesFinancièresActuelles: this.#actuelles
          ? {
              type: this.#actuelles.garantiesFinancières.type.formatter(),
              attestation: this.#actuelles.garantiesFinancières.constitution?.attestation,
              dateConstitution: this.#actuelles.garantiesFinancières.constitution?.date.formatter(),
              dateÉchéance: this.dateÉchéance?.formatter(),
            }
          : undefined,
      },
    };
    await this.publish(event);

    if (this.#dateLimiteSoumission && this.#motifDemande) {
      await this.demander({
        demandéLe: suppriméLe,
        dateLimiteSoumission: this.#dateLimiteSoumission,
        motif: this.#motifDemande,
      });
    }
    // Un dépôt de GF annule les tâches planifiées, donc on doit les recréer si le dépôt est supprimé.
    await this.planifierÉchéance(suppriméLe);
  }

  //#endregion Behavior Dépôt

  //#region Behavior Mainlevée

  async demanderMainlevée({ motif, demandéLe, demandéPar }: DemanderMainlevéeOptions) {
    if (motif.estProjetAbandonné() && !this.lauréat.abandon.statut.estAccordé()) {
      throw new ProjetNonAbandonnéError();
    }

    if (motif.estProjetAchevé() && !this.lauréat.achèvement.estAchevé) {
      throw new ProjetNonAchevéError();
    }

    this.vérifierQueLesGarantiesFinancièresActuellesExistent();
    this.vérifierQueLesGarantiesFinancièresSontConstituées(this.#actuelles!.garantiesFinancières);
    this.vérifierQueLeProjetNEstPasExempt();

    if (this.#estÉchu) {
      throw new GarantiesFinancièresDéjàÉchuesError();
    }

    this.#statutMainlevée?.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutMainlevéeGarantiesFinancières.demandé,
    );

    if (this.aUnDépôtEnCours) {
      throw new DépôtDeGarantiesFinancièresÀSupprimerError();
    }

    const event: MainlevéeGarantiesFinancièresDemandéeEvent = {
      type: 'MainlevéeGarantiesFinancièresDemandée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        motif: motif.motif,
        demandéLe: demandéLe.formatter(),
        demandéPar: demandéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async annulerMainlevée({ annuléLe, annuléPar }: AnnulerMainlevéeOption) {
    if (!this.#statutMainlevée) {
      throw new MainlevéeNonTrouvéeError();
    }

    if (this.#statutMainlevée.estAccordé()) {
      throw new MainlevéeDéjàAccordéeError();
    }

    if (this.#statutMainlevée.estRejeté()) {
      throw new MainlevéeDéjàRejetéeError();
    }
    if (this.#statutMainlevée.estEnInstruction()) {
      throw new MainlevéeDéjàEnInstructionError();
    }

    const event: DemandeMainlevéeGarantiesFinancièresAnnuléeEvent = {
      type: 'DemandeMainlevéeGarantiesFinancièresAnnulée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: annuléLe.formatter(),
        annuléPar: annuléPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async démarrerInstructionMainlevée({
    démarréLe,
    démarréPar,
  }: DémarrerInstructionMainlevéeOptions) {
    if (!this.#statutMainlevée) {
      throw new MainlevéeNonTrouvéeError();
    }

    this.#statutMainlevée.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutMainlevéeGarantiesFinancières.enInstruction,
    );

    const event: InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent = {
      type: 'InstructionDemandeMainlevéeGarantiesFinancièresDémarrée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        démarréLe: démarréLe.formatter(),
        démarréPar: démarréPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async accorderMainlevée({
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  }: AccorderMainlevéeOptions) {
    if (!this.#statutMainlevée) {
      throw new MainlevéeNonTrouvéeError();
    }
    this.#statutMainlevée.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutMainlevéeGarantiesFinancières.accordé,
    );

    const event: DemandeMainlevéeGarantiesFinancièresAccordéeEvent = {
      type: 'DemandeMainlevéeGarantiesFinancièresAccordée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        accordéLe: accordéLe.formatter(),
        accordéPar: accordéPar.formatter(),
        réponseSignée: {
          format,
        },
      },
    };

    await this.publish(event);

    await this.annulerTâchesPlanififées();
  }

  async rejeterMainlevée({ rejetéLe, rejetéPar, réponseSignée }: RejeterMainlevéeOptions) {
    if (!this.#statutMainlevée) {
      throw new MainlevéeNonTrouvéeError();
    }

    this.#statutMainlevée.vérifierQueLeChangementDeStatutEstPossibleEn(
      StatutMainlevéeGarantiesFinancières.rejeté,
    );

    const event: DemandeMainlevéeGarantiesFinancièresRejetéeEvent = {
      type: 'DemandeMainlevéeGarantiesFinancièresRejetée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        rejetéLe: rejetéLe.formatter(),
        rejetéPar: rejetéPar.formatter(),
        réponseSignée: {
          format: réponseSignée.format,
        },
      },
    };

    await this.publish(event);
  }

  //#endregion Behavior Mainlevée

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
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
      }),
      soumisLe: DateTime.convertirEnValueType(soumisLe),
    };
  }

  private applyDépôtGarantiesFinancièresEnCoursModifiéV1({
    payload: { type, dateÉchéance, attestation, dateConstitution, modifiéLe },
  }: DépôtGarantiesFinancièresEnCoursModifiéEvent) {
    this.#dépôtEnCours = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
      }),
      soumisLe: DateTime.convertirEnValueType(modifiéLe),
    };
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV1(
    _: DépôtGarantiesFinancièresEnCoursValidéEventV1,
  ) {
    // l'évènement v1 ne contenait pas l'attestation, mais utilisait le dépôt en cours
    this.#actuelles = this.#dépôtEnCours;
    this.#dépôtEnCours = undefined;
  }

  private applyDépôtGarantiesFinancièresEnCoursValidéV2({
    payload: { dateÉchéance, type, attestation, dateConstitution },
  }: DépôtGarantiesFinancièresEnCoursValidéEvent) {
    this.#dépôtEnCours = undefined;
    this.#actuelles = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
      }),
    };
  }

  //#endregion Apply Dépôt

  //#region Apply Actuelles

  private applyGarantiesFinancièresEnregistréesV1({
    payload: { dateÉchéance, type, attestation, dateConstitution },
  }: GarantiesFinancièresEnregistréesEvent) {
    this.#actuelles = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
      }),
    };
  }

  private applyGarantiesFinancièresModifiéesV1({
    payload: { type, dateÉchéance, attestation, dateConstitution },
  }: GarantiesFinancièresModifiéesEvent) {
    this.#actuelles = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        attestation,
        dateConstitution,
      }),
    };
  }

  private applyHistoriqueGarantiesFinancièresEffacéV1(
    _: HistoriqueGarantiesFinancièresEffacéEvent,
  ) {
    this.#actuelles = undefined;
    this.#dépôtEnCours = undefined;
  }

  private applyTypeGarantiesFinancièresImportéV1({
    payload: { type, dateÉchéance },
  }: TypeGarantiesFinancièresImportéEvent) {
    this.#actuelles = {
      garantiesFinancières: GarantiesFinancières.convertirEnValueType({
        type,
        dateÉchéance,
        dateConstitution: undefined,
        attestation: undefined,
      }),
    };
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

  private applyAttestationGarantiesFinancièresEnregistréeV1({
    payload: { attestation, dateConstitution },
  }: AttestationGarantiesFinancièresEnregistréeEvent) {
    if (this.#actuelles) {
      this.#actuelles.garantiesFinancières = {
        ...this.#actuelles.garantiesFinancières,
        constitution: { attestation, date: DateTime.convertirEnValueType(dateConstitution) },
      };
    }
  }
  //#endregion Apply GF Actuelles

  //#region Apply Mainlevée

  private applyMainlevéeGarantiesFinancièresDemandéeV1(
    _: MainlevéeGarantiesFinancièresDemandéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.demandé;
  }

  private applyDemandeMainlevéeGarantiesFinancièresAnnuléeV1(
    _: DemandeMainlevéeGarantiesFinancièresAnnuléeEvent,
  ) {
    this.#statutMainlevée = undefined;
  }

  private applyInstructionDemandeMainlevéeGarantiesFinancièresDémarréeV1(
    _: InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.enInstruction;
  }

  private applyDemandeMainlevéeGarantiesFinancièresRejetéeV1(
    _: DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.rejeté;
  }

  private applyDemandeMainlevéeGarantiesFinancièresAccordéeV1(
    _: DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
  ) {
    this.#statutMainlevée = StatutMainlevéeGarantiesFinancières.accordé;
  }

  //#endregion Apply Mainlevée
}
