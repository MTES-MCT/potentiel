import { match, P } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { AbstractAggregate, type AggregateType } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { IdentifiantProjet } from '../../index.js';
import type { LauréatAggregate } from '../lauréat.aggregate.js';
import { ChangementImpossibleCarProjetAchevéError } from '../lauréat.error.js';
import { TypeTâche } from '../tâche/index.js';
import type { TâcheAggregate } from '../tâche/tâche.aggregate.js';
import type { TâchePlanifiéeAggregate } from '../tâche-planifiée/tâchePlanifiée.aggregate.js';
import type { AttribuerGestionnaireRéseauOptions } from './attribuer/attribuerGestionnaireRéseau.options.js';
import type { ModifierDocumentOptions } from './document/modifier/modifierDocumentRaccordement.options.js';
import type { SupprimerDocumentOptions } from './document/supprimer/supprimerDocumentRaccordement.options.js';
import type { TransmettreDocumentOptions } from './document/transmettre/transmettreDocumentRaccordement.options.js';
import {
  DateDansLeFuturError,
  DateDeMiseEnServiceNonModifiéeError,
  DateMiseEnServiceAntérieureDateDésignationProjetError,
  DateMiseEnServiceDéjàTransmiseError,
  DemandeComplèteDeRaccordementNonModifiéeError,
  DemandeComplèteRaccordementNonModifiableCarDossierMisEnServiceError,
  DocumentNonModifiableCarDossierMisEnServiceError,
  DocumentRaccordementNonExistantError,
  DocumentRaccordementNonModifiéError,
  DossierMisEnServiceNonSupprimableError,
  DossierNonRéférencéPourLeRaccordementDuProjetError,
  DossierRaccordementPasEnServiceError,
  FormatRéférenceDossierRaccordementInvalideError,
  GestionnaireRéseauDéjàExistantError,
  GestionnaireRéseauIdentiqueError,
  GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError,
  RéférenceDossierRaccordementDéjàExistantePourLeProjetError,
  RéférenceDossierRaccordementNonModifiableCarDossierMisEnServiceError,
  RéférencesDossierRaccordementIdentiquesError,
} from './errors.js';
import {
  RéférenceDossierRaccordement,
  TypeDocumentsRaccordement,
  TypeTâchePlanifiéeRaccordement,
} from './index.js';
import type { ModifierDateMiseEnServiceOptions } from './modifier/dateMiseEnService/modifierDateMiseEnService.options.js';
import type { ModifierDemandeComplèteOptions } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.options.js';
import type { ModifierGestionnaireRéseauOptions } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseau.options.js';
import type { ModifierRéférenceDossierRaccordementOptions } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.options.js';
import type {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DateMiseEnServiceModifiéeEvent,
  DateMiseEnServiceSuppriméeEvent,
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseV1Event,
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseEventV1,
  DemandeComplèteRaccordementTransmiseEventV2,
  DocumentRaccordementModifiéEventV1,
  DocumentRaccordementSuppriméEventV1,
  DocumentRaccordementTransmisEventV1,
  DossierDuRaccordementSuppriméEvent,
  DossierDuRaccordementSuppriméEventV1,
  GestionnaireRéseauAttribuéEvent,
  GestionnaireRéseauInconnuAttribuéEvent,
  GestionnaireRéseauRaccordementModifiéEvent,
  GestionnaireRéseauRaccordementModifiéEventV1,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
  PropositionTechniqueEtFinancièreModifiéeEventV2,
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEventV2,
  RaccordementEvent,
  RaccordementRéactivéEvent,
  RaccordementSuppriméEvent,
  RéférenceDossierRacordementModifiéeEvent,
  RéférenceDossierRacordementModifiéeEventV1,
} from './raccordement.event.js';
import type { SupprimerDateMiseEnServiceOptions } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.options.js';
import type { SupprimerDossierDuRaccordementOptions } from './supprimer/dossier/supprimerDossierDuRaccordement.options.js';
import type { TransmettreDateMiseEnServiceOptions } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.options.js';
import type { TransmettreDemandeOptions } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.options.js';

type DossierRaccordement = {
  référence: RéférenceDossierRaccordement.ValueType;
  demandeComplèteRaccordement: {
    dateQualification: Option.Type<DateTime.ValueType>;
    format: Option.Type<string>;
  };
  miseEnService: {
    dateMiseEnService: Option.Type<DateTime.ValueType>;
  };
  propositionTechniqueEtFinancière?: {
    dateSignature?: DateTime.ValueType;
    format?: string;
  };
  conventionDeRaccordement?: {
    dateSignature: DateTime.ValueType;
    format: string;
  };
  conventionDeRaccordementDirecte?: {
    dateSignature: DateTime.ValueType;
    format: string;
  };
};

export class RaccordementAggregate extends AbstractAggregate<
  RaccordementEvent,
  'raccordement',
  LauréatAggregate
> {
  #désactivé?: true;
  #gestionnaireRéseau!: AggregateType<GestionnaireRéseau.GestionnaireRéseauAggregate>;
  #dossiers: Map<string, DossierRaccordement> = new Map();

  #identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;

  // Tâches
  #tâcheTransmettreRéférenceRaccordement!: AggregateType<TâcheAggregate>;
  #tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement!: AggregateType<TâcheAggregate>;
  #tâcheGestionnaireRéseauInconnuAttribué!: AggregateType<TâcheAggregate>;

  // Tâches planifiées
  #tâchePlanifiéeRelanceDemandeComplèteRaccordement!: AggregateType<TâchePlanifiéeAggregate>;

  async init() {
    this.#gestionnaireRéseau = await this.loadGestionnaireRéseau(
      this.#identifiantGestionnaireRéseau.codeEIC,
    );

    this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement = await this.lauréat.loadTâche(
      TypeTâche.raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement.type,
    );

    this.#tâcheTransmettreRéférenceRaccordement = await this.lauréat.loadTâche(
      TypeTâche.raccordementRéférenceNonTransmise.type,
    );

    this.#tâcheGestionnaireRéseauInconnuAttribué = await this.lauréat.loadTâche(
      TypeTâche.raccordementGestionnaireRéseauInconnuAttribué.type,
    );

    this.#tâchePlanifiéeRelanceDemandeComplèteRaccordement = await this.lauréat.loadTâchePlanifiée(
      TypeTâchePlanifiéeRaccordement.relanceTransmissionDeLaDemandeComplèteRaccordement.type,
    );
  }

  //#region helpers
  get lauréat() {
    return this.parent;
  }
  get estDésactivé() {
    return this.#désactivé;
  }

  private get identifiantProjet(): IdentifiantProjet.ValueType {
    return this.lauréat.projet.identifiantProjet;
  }

  private get référenceDossierExpressionRegulière() {
    return this.#gestionnaireRéseau.référenceDossierRaccordementExpressionRegulière;
  }

  private contientLeDossier({ référence }: RéférenceDossierRaccordement.ValueType) {
    return this.#dossiers.has(référence);
  }

  private récupérerDossier(référence: RéférenceDossierRaccordement.RawType) {
    const dossier = this.#dossiers.get(référence);

    if (!dossier) {
      throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
    }

    return dossier;
  }

  private récupérerArrayDocumentsDossier(
    référence: RéférenceDossierRaccordement.RawType,
  ): TypeDocumentsRaccordement.RawType[] {
    const dossier = this.récupérerDossier(référence);

    const documentsDossier: TypeDocumentsRaccordement.RawType[] = [];

    if (dossier.propositionTechniqueEtFinancière) {
      documentsDossier.push(TypeDocumentsRaccordement.propositionTechniqueEtFinancière.type);
    }
    if (dossier.conventionDeRaccordement) {
      documentsDossier.push(TypeDocumentsRaccordement.conventionDeRaccordement.type);
    }
    if (dossier.conventionDeRaccordementDirecte) {
      documentsDossier.push(TypeDocumentsRaccordement.conventionDeRaccordementDirecte.type);
    }
    return documentsDossier;
  }

  private vérifierStatutDuLauréat() {
    if (!this.lauréat.powerPurchaseAgreement.estPartiEnPPA) {
      this.lauréat.vérifierNiAbandonnéNiEnCoursAbandon();
    }
  }

  public aUneDateDeMiseEnServiceDansIntervalle(intervalle: { min: string; max: string }): boolean {
    for (const [, dossier] of this.#dossiers.entries()) {
      if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
        if (
          dossier.miseEnService.dateMiseEnService.estDansIntervalle({
            min: DateTime.convertirEnValueType(new Date(intervalle.min)),
            max: DateTime.convertirEnValueType(new Date(intervalle.max)),
          })
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private aUneDateDeMiseEnService(): boolean {
    for (const [, dossier] of this.#dossiers.entries()) {
      if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
        return true;
      }
    }
    return false;
  }

  async annulerTâchesEtTâchesPlanifiées() {
    await this.#tâchePlanifiéeRelanceDemandeComplèteRaccordement.annuler();
    await this.#tâcheGestionnaireRéseauInconnuAttribué.achever();
    await this.#tâcheTransmettreRéférenceRaccordement.achever();
    await this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement.achever();
  }

  async ajouterTâchesEtTâchesPlanifiées() {
    const dossiersRaccordements = [...this.#dossiers.values()];
    if (dossiersRaccordements.length === 0) {
      await this.#tâcheTransmettreRéférenceRaccordement.ajouter();

      let àExécuterLe = this.lauréat.notifiéLe.ajouterNombreDeMois(2);
      if (this.lauréat.notifiéLe.estPassée()) {
        àExécuterLe = DateTime.now().ajouterNombreDeJours(1);
      }
      await this.#tâchePlanifiéeRelanceDemandeComplèteRaccordement.ajouter({
        àExécuterLe,
      });
    }

    const dossierRaccordementSansAccuséDeRéception = dossiersRaccordements.filter((dossier) =>
      Option.isNone(dossier.demandeComplèteRaccordement.format),
    );
    if (dossierRaccordementSansAccuséDeRéception.length > 0) {
      await this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement.ajouter();
    } else {
      await this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement.achever();
    }

    if (this.#gestionnaireRéseau.identifiantGestionnaireRéseau.estInconnu()) {
      await this.#tâcheGestionnaireRéseauInconnuAttribué.ajouter();
    }
  }
  //#endregion helpers

  //#region gestionnaire de réseau

  async loadGestionnaireRéseau(codeEIC: string) {
    return await this.loadAggregate(
      GestionnaireRéseau.GestionnaireRéseauAggregate,
      `gestionnaire-réseau|${codeEIC}`,
    );
  }

  async attribuerGestionnaireRéseau({
    identifiantGestionnaireRéseau,
  }: AttribuerGestionnaireRéseauOptions) {
    const gestionnaireRéseauDéjàAttribué = !this.#identifiantGestionnaireRéseau.estInconnu();

    if (gestionnaireRéseauDéjàAttribué) {
      throw new GestionnaireRéseauDéjàExistantError(this.identifiantProjet.formatter());
    }

    if (identifiantGestionnaireRéseau.estInconnu()) {
      const event: GestionnaireRéseauInconnuAttribuéEvent = {
        type: 'GestionnaireRéseauInconnuAttribué-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);

      await this.#tâcheGestionnaireRéseauInconnuAttribué.ajouter();
    } else {
      const gestionnaireRéseau = await this.loadGestionnaireRéseau(
        identifiantGestionnaireRéseau.codeEIC,
      );
      gestionnaireRéseau.vérifierQueLeGestionnaireExiste();

      const event: GestionnaireRéseauAttribuéEvent = {
        type: 'GestionnaireRéseauAttribué-V1',
        payload: {
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);
    }
    await this.ajouterTâchesEtTâchesPlanifiées();
  }
  private applyGestionnaireRéseauRaccordemenInconnuEventV1(
    _: GestionnaireRéseauInconnuAttribuéEvent,
  ) {
    this.#identifiantGestionnaireRéseau = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;
  }

  private applyAttribuerGestionnaireRéseauEventV1({
    payload: { identifiantGestionnaireRéseau },
  }: GestionnaireRéseauAttribuéEvent) {
    this.#identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      );
  }

  async modifierGestionnaireRéseau({
    identifiantGestionnaireRéseau,
    rôle,
    modifiéLe,
    modifiéPar,
  }: ModifierGestionnaireRéseauOptions) {
    this.vérifierStatutDuLauréat();
    if (
      this.aUneDateDeMiseEnService() &&
      !rôle.aLaPermission('raccordement.gestionnaire.modifier-après-mise-en-service')
    ) {
      throw new GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError();
    }

    if (
      this.lauréat.statut.estAchevé() &&
      !this.#identifiantGestionnaireRéseau.estInconnu() &&
      !rôle.aLaPermission('raccordement.gestionnaire.modifier-après-achèvement')
    ) {
      throw new ChangementImpossibleCarProjetAchevéError();
    }

    if (!identifiantGestionnaireRéseau.estInconnu()) {
      const gestionnaireRéseau = await this.loadGestionnaireRéseau(
        identifiantGestionnaireRéseau.codeEIC,
      );
      gestionnaireRéseau.vérifierQueLeGestionnaireExiste();
    }

    if (this.#identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)) {
      throw new GestionnaireRéseauIdentiqueError(
        this.identifiantProjet,
        identifiantGestionnaireRéseau,
      );
    }

    if (identifiantGestionnaireRéseau.estInconnu()) {
      const event: GestionnaireRéseauInconnuAttribuéEvent = {
        type: 'GestionnaireRéseauInconnuAttribué-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);

      await this.#tâcheGestionnaireRéseauInconnuAttribué.ajouter();
    } else {
      const event: GestionnaireRéseauRaccordementModifiéEvent = {
        type: 'GestionnaireRéseauRaccordementModifié-V2',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
          modifiéPar: modifiéPar.formatter(),
          modifiéLe: modifiéLe.formatter(),
        },
      };

      await this.publish(event);

      await this.#tâcheGestionnaireRéseauInconnuAttribué.achever();
    }
  }
  private applyGestionnaireRéseauRaccordementModifiéEvent({
    payload: { identifiantGestionnaireRéseau },
  }: GestionnaireRéseauRaccordementModifiéEventV1 | GestionnaireRéseauRaccordementModifiéEvent) {
    this.#identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      );
  }

  //#endregion gestionnaire de réseau

  //#region Raccordement

  async modifierRéférenceDossierRacordement({
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    modifiéeLe,
    modifiéePar,
    rôle,
  }: ModifierRéférenceDossierRaccordementOptions) {
    this.vérifierStatutDuLauréat();
    if (nouvelleRéférenceDossierRaccordement.estÉgaleÀ(référenceDossierRaccordementActuelle)) {
      throw new RéférencesDossierRaccordementIdentiquesError();
    }

    if (
      !this.référenceDossierExpressionRegulière.valider(
        nouvelleRéférenceDossierRaccordement.référence,
      )
    ) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    if (this.contientLeDossier(nouvelleRéférenceDossierRaccordement)) {
      throw new RéférenceDossierRaccordementDéjàExistantePourLeProjetError();
    }

    const dossier = this.récupérerDossier(référenceDossierRaccordementActuelle.formatter());

    if (
      (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal)) &&
      Option.isSome(dossier.miseEnService.dateMiseEnService)
    ) {
      throw new RéférenceDossierRaccordementNonModifiableCarDossierMisEnServiceError(
        référenceDossierRaccordementActuelle.formatter(),
      );
    }

    const référenceDossierRacordementModifiée: RéférenceDossierRacordementModifiéeEvent = {
      type: 'RéférenceDossierRacordementModifiée-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        nouvelleRéférenceDossierRaccordement: nouvelleRéférenceDossierRaccordement.formatter(),
        référenceDossierRaccordementActuelle: référenceDossierRaccordementActuelle.formatter(),
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
      },
    };

    await this.publish(référenceDossierRacordementModifiée);

    await this.#tâcheTransmettreRéférenceRaccordement.achever();
  }
  private applyRéférenceDossierRacordementModifiéeEvent({
    payload: { nouvelleRéférenceDossierRaccordement, référenceDossierRaccordementActuelle },
  }: RéférenceDossierRacordementModifiéeEvent | RéférenceDossierRacordementModifiéeEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordementActuelle);

    dossier.référence = RéférenceDossierRaccordement.convertirEnValueType(
      nouvelleRéférenceDossierRaccordement,
    );

    this.#dossiers.delete(référenceDossierRaccordementActuelle);
    this.#dossiers.set(nouvelleRéférenceDossierRaccordement, dossier);
  }

  async supprimerDossier({
    référenceDossier,
    suppriméLe,
    suppriméPar,
    rôle,
  }: SupprimerDossierDuRaccordementOptions) {
    this.vérifierStatutDuLauréat();

    const dossierActuel = this.récupérerDossier(référenceDossier.formatter());

    if (
      Option.isSome(dossierActuel.miseEnService.dateMiseEnService) &&
      !rôle.aLaPermission('raccordement.dossier.supprimer-après-mise-en-service')
    ) {
      throw new DossierMisEnServiceNonSupprimableError();
    }

    if (
      this.lauréat.statut.estAchevé() &&
      !rôle.aLaPermission('raccordement.dossier.supprimer-après-achèvement')
    ) {
      throw new ChangementImpossibleCarProjetAchevéError();
    }

    const dossierDuRaccordementSupprimé: DossierDuRaccordementSuppriméEvent = {
      type: 'DossierDuRaccordementSupprimé-V2',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossier: référenceDossier.formatter(),
        suppriméLe: suppriméLe.formatter(),
        suppriméPar: suppriméPar.formatter(),
      },
    };

    await this.publish(dossierDuRaccordementSupprimé);
    await this.ajouterTâchesEtTâchesPlanifiées();
  }

  private applyDossierDuRaccordementSuppriméEventV1({
    payload,
  }: DossierDuRaccordementSuppriméEventV1) {
    this.#dossiers.delete(payload.référenceDossier);
  }
  private applyDossierDuRaccordementSuppriméEventV2({
    payload,
  }: DossierDuRaccordementSuppriméEvent) {
    this.#dossiers.delete(payload.référenceDossier);
  }

  async supprimerRaccordement(raison: string) {
    const raccordementSupprimé: RaccordementSuppriméEvent = {
      type: 'RaccordementSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        raison,
      },
    };

    await this.publish(raccordementSupprimé);

    await this.#tâcheTransmettreRéférenceRaccordement.achever();
    await this.#tâcheGestionnaireRéseauInconnuAttribué.achever();
  }
  private applyRaccordementSuppriméEventV1() {
    this.#désactivé = true;
  }

  async réactiverRaccordement(raison: string) {
    const raccordementReactivé: RaccordementRéactivéEvent = {
      type: 'RaccordementRéactivé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        raison,
      },
    };

    await this.publish(raccordementReactivé);

    // @TODO autre PR : recréer tâches raccordement si nécessaire
  }
  private applyRaccordementReactivéEventV1() {
    this.#désactivé = undefined;
  }
  //#endregion dossier de raccordement

  //#region PTF (OLD)

  private applyPropositionTechniqueEtFinancièreTransmiseEventV1({
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreTransmiseEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.propositionTechniqueEtFinancière = {
      ...dossier.propositionTechniqueEtFinancière,
      dateSignature: DateTime.convertirEnValueType(dateSignature),
    };
  }

  private applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1({
    payload: { référenceDossierRaccordement, format },
  }: PropositionTechniqueEtFinancièreSignéeTransmiseEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.propositionTechniqueEtFinancière = {
      ...dossier.propositionTechniqueEtFinancière,
      format,
    };
  }

  private applyPropositionTechniqueEtFinancièreTransmiseEvent({
    payload: {
      dateSignature,
      référenceDossierRaccordement,
      propositionTechniqueEtFinancièreSignée: { format },
    },
  }:
    | PropositionTechniqueEtFinancièreTransmiseEventV2
    | PropositionTechniqueEtFinancièreTransmiseEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.propositionTechniqueEtFinancière = {
      dateSignature: DateTime.convertirEnValueType(dateSignature),
      format,
    };
  }

  private applyPropositionTechniqueEtFinancièreModifiéeEventV1({
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreModifiéeEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.propositionTechniqueEtFinancière = {
      ...dossier.propositionTechniqueEtFinancière,
      dateSignature: DateTime.convertirEnValueType(dateSignature),
    };
  }

  private applyPropositionTechniqueEtFinancièreModifiéeEvent({
    payload: {
      dateSignature,
      propositionTechniqueEtFinancièreSignée,
      référenceDossierRaccordement,
    },
  }: PropositionTechniqueEtFinancièreModifiéeEventV2) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.propositionTechniqueEtFinancière = {
      ...dossier.propositionTechniqueEtFinancière,
      dateSignature: DateTime.convertirEnValueType(dateSignature),
      ...(propositionTechniqueEtFinancièreSignée && {
        format: propositionTechniqueEtFinancièreSignée.format,
      }),
    };
  }

  //#endregion PTF

  //#region Document Raccordement

  async transmettreDocumentRaccordement({
    dateSignature,
    référenceDossierRaccordement,
    formatDocumentRaccordement,
    transmisLe,
    transmisPar,
    type,
  }: TransmettreDocumentOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.vérifierStatutDuLauréat();

    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const documentsDossier = this.récupérerArrayDocumentsDossier(
      référenceDossierRaccordement.formatter(),
    );
    type.vérifierQuePeutÊtreTransmis(documentsDossier);

    const event: DocumentRaccordementTransmisEventV1 = {
      type: 'DocumentRaccordementTransmis-V1',
      payload: {
        dateSignature: dateSignature.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        document: {
          format: formatDocumentRaccordement,
        },
        type: type.formatter(),
        transmisLe: transmisLe.formatter(),
        transmisPar: transmisPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async modifierDocumentRaccordement({
    dateSignature,
    référenceDossierRaccordement,
    formatDocumentRaccordement,
    estUnNouveauDocument,
    rôle,
    modifiéLe,
    modifiéPar,
    type,
  }: ModifierDocumentOptions) {
    this.vérifierStatutDuLauréat();

    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const dossier = this.récupérerDossier(référenceDossierRaccordement.formatter());
    const dossierEstEnService = Option.isSome(dossier.miseEnService.dateMiseEnService);
    const document = type.estPropositionTechniqueEtFinancière()
      ? dossier.propositionTechniqueEtFinancière
      : type.estConventionDeRaccordement()
        ? dossier.conventionDeRaccordement
        : dossier.conventionDeRaccordementDirecte;

    if (!document) {
      throw new DocumentRaccordementNonExistantError();
    }

    if (
      dossier.référence.estÉgaleÀ(référenceDossierRaccordement) &&
      !estUnNouveauDocument &&
      document?.dateSignature &&
      dateSignature.estÉgaleÀ(document.dateSignature)
    ) {
      throw new DocumentRaccordementNonModifiéError();
    }

    if (
      dossierEstEnService &&
      !rôle.aLaPermission(
        'raccordement.document-raccordement.modifier-ou-supprimer-après-mise-en-service',
      )
    ) {
      throw new DocumentNonModifiableCarDossierMisEnServiceError();
    }

    if (
      this.lauréat.statut.estAchevé() &&
      !rôle.aLaPermission(
        'raccordement.document-raccordement.modifier-ou-supprimer-après-achèvement',
      )
    ) {
      throw new ChangementImpossibleCarProjetAchevéError();
    }

    const event: DocumentRaccordementModifiéEventV1 = {
      type: 'DocumentRaccordementModifié-V1',
      payload: {
        dateSignature: dateSignature.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        document: {
          format: formatDocumentRaccordement,
        },
        type: type.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async supprimerDocumentRaccordement({
    référenceDossierRaccordement,
    suppriméLe,
    suppriméPar,
    type,
    rôle,
  }: SupprimerDocumentOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.vérifierStatutDuLauréat();

    const dossier = this.récupérerDossier(référenceDossierRaccordement.formatter());
    const documentsDossier = this.récupérerArrayDocumentsDossier(
      référenceDossierRaccordement.formatter(),
    );

    if (!documentsDossier.includes(type.formatter())) {
      throw new DocumentRaccordementNonExistantError();
    }

    const dossierEstEnService = Option.isSome(dossier.miseEnService.dateMiseEnService);

    if (
      dossierEstEnService &&
      !rôle.aLaPermission(
        'raccordement.document-raccordement.modifier-ou-supprimer-après-mise-en-service',
      )
    ) {
      throw new DocumentNonModifiableCarDossierMisEnServiceError();
    }

    if (
      this.lauréat.statut.estAchevé() &&
      !rôle.aLaPermission(
        'raccordement.document-raccordement.modifier-ou-supprimer-après-achèvement',
      )
    ) {
      throw new ChangementImpossibleCarProjetAchevéError();
    }

    const event: DocumentRaccordementSuppriméEventV1 = {
      type: 'DocumentRaccordementSupprimé-V1',
      payload: {
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        type: type.formatter(),
        suppriméLe: suppriméLe.formatter(),
        suppriméPar: suppriméPar.formatter(),
      },
    };

    await this.publish(event);
  }

  private applyDocumentRaccordementTransmisOuModifiéEventV1({
    payload: {
      dateSignature,
      référenceDossierRaccordement,
      document: { format },
      type,
    },
  }: DocumentRaccordementTransmisEventV1 | DocumentRaccordementModifiéEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier[TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(type)] = {
      dateSignature: DateTime.convertirEnValueType(dateSignature),
      format,
    };
  }

  private applyDocumentRaccordementSuppriméEventV1({
    payload: { référenceDossierRaccordement, type },
  }: DocumentRaccordementSuppriméEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier[TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(type)] = undefined;
  }

  //#endregion Document Raccordement

  //#region DCR
  async transmettreDemandeComplèteDeRaccordement({
    dateQualification,
    référenceDossier,
    formatAccuséRéception,
    transmisePar,
    transmiseLe,
  }: TransmettreDemandeOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.vérifierStatutDuLauréat();

    if (!this.référenceDossierExpressionRegulière.valider(référenceDossier.référence)) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    if (this.contientLeDossier(référenceDossier)) {
      throw new RéférenceDossierRaccordementDéjàExistantePourLeProjetError();
    }

    if (dateQualification.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const event: DemandeComplèteRaccordementTransmiseEvent = {
      type: 'DemandeComplèteDeRaccordementTransmise-V3',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        dateQualification: dateQualification?.formatter(),
        identifiantGestionnaireRéseau: this.#identifiantGestionnaireRéseau.formatter(),
        référenceDossierRaccordement: référenceDossier.formatter(),
        accuséRéception: formatAccuséRéception
          ? {
              format: formatAccuséRéception,
            }
          : undefined,
        transmisePar: transmisePar.formatter(),
        transmiseLe: transmiseLe.formatter(),
      },
    };

    await this.publish(event);

    await this.#tâcheTransmettreRéférenceRaccordement.achever();

    if (!event.payload.accuséRéception) {
      await this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement.ajouter();
    }

    await this.#tâchePlanifiéeRelanceDemandeComplèteRaccordement.annuler();
  }
  private applyDemandeComplèteDeRaccordementTransmiseEventV1({
    payload: { identifiantGestionnaireRéseau, référenceDossierRaccordement, dateQualification },
  }: DemandeComplèteRaccordementTransmiseEventV1) {
    if (this.#identifiantGestionnaireRéseau.estInconnu()) {
      this.#identifiantGestionnaireRéseau =
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseau,
        );
    }

    this.#dossiers.set(référenceDossierRaccordement, {
      demandeComplèteRaccordement: {
        dateQualification: dateQualification
          ? DateTime.convertirEnValueType(dateQualification)
          : Option.none,
        format: Option.none,
      },
      miseEnService: {
        dateMiseEnService: Option.none,
      },
      propositionTechniqueEtFinancière: undefined,
      référence: référenceDossierRaccordement
        ? RéférenceDossierRaccordement.convertirEnValueType(référenceDossierRaccordement)
        : RéférenceDossierRaccordement.référenceNonTransmise,
    });
  }
  private applyDemandeComplèteDeRaccordementTransmiseEventV2({
    payload: {
      accuséRéception: { format },
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  }: DemandeComplèteRaccordementTransmiseEventV2) {
    this.applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this)({
      type: 'DemandeComplèteDeRaccordementTransmise-V1',
      payload: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
        référenceDossierRaccordement,
        dateQualification,
      },
    });
    this.applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)({
      type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
      payload: {
        format,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  }
  private applyDemandeComplèteDeRaccordementTransmiseEventV3({
    payload: {
      accuséRéception,
      identifiantGestionnaireRéseau,
      identifiantProjet,
      référenceDossierRaccordement,
      dateQualification,
    },
  }: DemandeComplèteRaccordementTransmiseEvent) {
    this.applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this)({
      type: 'DemandeComplèteDeRaccordementTransmise-V1',
      payload: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
        référenceDossierRaccordement,
        dateQualification,
      },
    });

    if (accuséRéception) {
      this.applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this)({
        type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
        payload: {
          format: accuséRéception.format,
          identifiantProjet,
          référenceDossierRaccordement,
        },
      });
    }
  }
  private applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1({
    payload: { référenceDossierRaccordement, format },
  }: AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.demandeComplèteRaccordement.format = format;
  }

  async modifierDemandeComplèteRaccordement({
    dateQualification,
    référenceDossierRaccordement,
    rôle,
    modifiéeLe,
    modifiéePar,
    accuséRéception: { format },
    estUnNouveauDocument,
  }: ModifierDemandeComplèteOptions) {
    this.vérifierStatutDuLauréat();

    const dossier = this.récupérerDossier(référenceDossierRaccordement.formatter());

    const dossierEnService = Option.isSome(dossier.miseEnService.dateMiseEnService);

    const dcrComplète =
      Option.isSome(dossier.demandeComplèteRaccordement.dateQualification) &&
      Option.isSome(dossier.demandeComplèteRaccordement.format);

    if (dateQualification.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (!this.référenceDossierExpressionRegulière.valider(référenceDossierRaccordement.référence)) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    if (
      !estUnNouveauDocument &&
      Option.isSome(dossier.demandeComplèteRaccordement.dateQualification) &&
      dateQualification.estÉgaleÀ(dossier.demandeComplèteRaccordement.dateQualification)
    ) {
      throw new DemandeComplèteDeRaccordementNonModifiéeError();
    }

    if (
      dossierEnService &&
      dcrComplète &&
      !rôle.aLaPermission(
        'raccordement.demande-complète-raccordement.modifier-après-mise-en-service',
      )
    ) {
      throw new DemandeComplèteRaccordementNonModifiableCarDossierMisEnServiceError();
    }

    if (
      dcrComplète &&
      this.lauréat.statut.estAchevé() &&
      !rôle.aLaPermission('raccordement.demande-complète-raccordement.modifier-après-achèvement')
    ) {
      throw new ChangementImpossibleCarProjetAchevéError();
    }

    const demandeComplèteRaccordementModifiée: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée-V4',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        dateQualification: dateQualification.formatter(),
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
        accuséRéception: { format },
      },
    };

    await this.publish(demandeComplèteRaccordementModifiée);

    await this.#tâcheRenseignerAccuséRéceptionDemandeComplèteRaccordement.achever();
  }
  private applyDemandeComplèteRaccordementModifiéeEventV1({
    payload: { dateQualification, nouvelleReference, referenceActuelle },
  }: DemandeComplèteRaccordementModifiéeEventV1) {
    const dossier = this.récupérerDossier(referenceActuelle);

    dossier.demandeComplèteRaccordement.dateQualification =
      DateTime.convertirEnValueType(dateQualification);
    dossier.référence = RéférenceDossierRaccordement.convertirEnValueType(nouvelleReference);

    this.#dossiers.delete(referenceActuelle);
    this.#dossiers.set(nouvelleReference, dossier);
  }
  private applyDemandeComplèteRaccordementModifiéeEventV2({
    payload: { dateQualification, référenceDossierRaccordement },
  }: DemandeComplèteRaccordementModifiéeEventV2) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.demandeComplèteRaccordement.dateQualification =
      DateTime.convertirEnValueType(dateQualification);
  }
  private applyDemandeComplèteRaccordementModifiéeEvent({
    payload: { accuséRéception, dateQualification, référenceDossierRaccordement },
  }: DemandeComplèteRaccordementModifiéeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.demandeComplèteRaccordement.dateQualification =
      DateTime.convertirEnValueType(dateQualification);

    if (accuséRéception) {
      dossier.demandeComplèteRaccordement.format = accuséRéception.format;
    }
  }
  //#endregion DCR

  //#region date de mise en service
  async transmettreDateMiseEnService({
    dateMiseEnService,
    dateDésignation,
    référenceDossier,
    transmiseLe,
    transmisePar,
  }: TransmettreDateMiseEnServiceOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.vérifierStatutDuLauréat();

    if (dateMiseEnService.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
      throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
    }

    const dossier = this.récupérerDossier(référenceDossier.formatter());
    if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
      throw new DateMiseEnServiceDéjàTransmiseError();
    }

    const dateMiseEnServiceTransmise: DateMiseEnServiceTransmiseEvent = {
      type: 'DateMiseEnServiceTransmise-V2',
      payload: {
        dateMiseEnService: dateMiseEnService.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossier.formatter(),
        transmiseLe: transmiseLe.formatter(),
        transmisePar: transmisePar.formatter(),
      },
    };

    await this.publish(dateMiseEnServiceTransmise);

    const délaiApplicable =
      this.lauréat.projet.cahierDesChargesActuel.cahierDesChargesModificatif?.délaiApplicable;

    if (délaiApplicable) {
      const { intervaleDateMiseEnService, délaiEnMois } = délaiApplicable;

      if (
        dateMiseEnService.estDansIntervalle({
          min: DateTime.convertirEnValueType(new Date(intervaleDateMiseEnService.min)),
          max: DateTime.convertirEnValueType(new Date(intervaleDateMiseEnService.max)),
        })
      ) {
        return this.lauréat.achèvement.calculerDateAchèvementPrévisionnel({
          type: 'ajout-délai-cdc-30_08_2022',
          nombreDeMois: délaiEnMois,
        });
      }
    }
  }
  private applyDateMiseEnServiceTransmiseEventV1({
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceTransmiseV1Event) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
  }
  private applyDateMiseEnServiceTransmiseEventV2({
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceTransmiseEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
  }

  async modifierDateMiseEnService({
    référenceDossier,
    dateMiseEnService,
    dateDésignation,
    modifiéeLe,
    modifiéePar,
  }: ModifierDateMiseEnServiceOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.vérifierStatutDuLauréat();

    const dossier = this.récupérerDossier(référenceDossier.formatter());

    if (Option.isNone(dossier.miseEnService.dateMiseEnService)) {
      throw new DossierRaccordementPasEnServiceError();
    }

    if (dateMiseEnService.estÉgaleÀ(dossier.miseEnService.dateMiseEnService)) {
      throw new DateDeMiseEnServiceNonModifiéeError();
    }

    if (dateMiseEnService.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
      throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
    }

    const event: DateMiseEnServiceModifiéeEvent = {
      type: 'DateMiseEnServiceModifiée-V2',
      payload: {
        dateMiseEnService: dateMiseEnService.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossier.formatter(),
        modifiéeLe: modifiéeLe.formatter(),
        modifiéePar: modifiéePar.formatter(),
      },
    };

    await this.publish(event);

    const délaiApplicable =
      this.lauréat.projet.cahierDesChargesActuel.cahierDesChargesModificatif?.délaiApplicable;

    if (délaiApplicable) {
      const { intervaleDateMiseEnService, délaiEnMois } = délaiApplicable;

      if (
        dateMiseEnService.estDansIntervalle({
          min: DateTime.convertirEnValueType(new Date(intervaleDateMiseEnService.min)),
          max: DateTime.convertirEnValueType(new Date(intervaleDateMiseEnService.max)),
        })
      ) {
        return this.lauréat.achèvement.calculerDateAchèvementPrévisionnel({
          type: 'ajout-délai-cdc-30_08_2022',
          nombreDeMois: délaiEnMois,
        });
      }
    }
  }
  private applyDateMiseEnServiceModifiéeEvent({
    payload: { dateMiseEnService, référenceDossierRaccordement },
  }: DateMiseEnServiceModifiéeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.miseEnService.dateMiseEnService = DateTime.convertirEnValueType(dateMiseEnService);
  }

  async supprimerDateMiseEnService({
    référenceDossier,
    suppriméeLe,
    suppriméePar,
  }: SupprimerDateMiseEnServiceOptions) {
    this.vérifierStatutDuLauréat();
    const { miseEnService } = this.récupérerDossier(référenceDossier.formatter());

    if (Option.isNone(miseEnService.dateMiseEnService)) {
      throw new DossierRaccordementPasEnServiceError();
    }

    const dateMiseEnServiceSupprimée: DateMiseEnServiceSuppriméeEvent = {
      type: 'DateMiseEnServiceSupprimée-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossier.formatter(),
        suppriméeLe: suppriméeLe.formatter(),
        suppriméePar: suppriméePar.formatter(),
      },
    };

    await this.publish(dateMiseEnServiceSupprimée);
  }
  private applyDateMiseEnServiceSuppriméeEventV1({
    payload: { référenceDossierRaccordement },
  }: DateMiseEnServiceSuppriméeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.miseEnService = {
      dateMiseEnService: Option.none,
    };
  }

  //#endregion date de mise en service

  apply(event: RaccordementEvent) {
    return match(event)
      .with(
        { type: 'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1' },
        this.applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1.bind(this),
      )
      .with(
        { type: 'DemandeComplèteDeRaccordementTransmise-V1' },
        this.applyDemandeComplèteDeRaccordementTransmiseEventV1.bind(this),
      )
      .with(
        { type: 'DemandeComplèteDeRaccordementTransmise-V2' },
        this.applyDemandeComplèteDeRaccordementTransmiseEventV2.bind(this),
      )
      .with(
        { type: 'DemandeComplèteDeRaccordementTransmise-V3' },
        this.applyDemandeComplèteDeRaccordementTransmiseEventV3.bind(this),
      )
      .with(
        { type: 'DemandeComplèteRaccordementModifiée-V1' },
        this.applyDemandeComplèteRaccordementModifiéeEventV1.bind(this),
      )
      .with(
        { type: 'DemandeComplèteRaccordementModifiée-V2' },
        this.applyDemandeComplèteRaccordementModifiéeEventV2.bind(this),
      )
      .with(
        {
          type: P.union(
            'DemandeComplèteRaccordementModifiée-V3',
            'DemandeComplèteRaccordementModifiée-V4',
          ),
        },
        this.applyDemandeComplèteRaccordementModifiéeEvent.bind(this),
      )
      .with(
        {
          type: P.union(
            'RéférenceDossierRacordementModifiée-V1',
            'RéférenceDossierRacordementModifiée-V2',
          ),
        },
        this.applyRéférenceDossierRacordementModifiéeEvent.bind(this),
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreTransmise-V1' },
        this.applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this),
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1' },
        this.applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1.bind(this),
      )
      .with(
        {
          type: P.union(
            'PropositionTechniqueEtFinancièreTransmise-V2',
            'PropositionTechniqueEtFinancièreTransmise-V3',
          ),
        },
        this.applyPropositionTechniqueEtFinancièreTransmiseEvent.bind(this),
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreModifiée-V1' },
        this.applyPropositionTechniqueEtFinancièreModifiéeEventV1.bind(this),
      )
      .with(
        {
          type: P.union(
            'PropositionTechniqueEtFinancièreModifiée-V2',
            'PropositionTechniqueEtFinancièreModifiée-V3',
          ),
        },
        this.applyPropositionTechniqueEtFinancièreModifiéeEvent.bind(this),
      )
      .with(
        {
          type: P.union('DocumentRaccordementTransmis-V1', 'DocumentRaccordementModifié-V1'),
        },
        this.applyDocumentRaccordementTransmisOuModifiéEventV1.bind(this),
      )
      .with(
        {
          type: 'DocumentRaccordementSupprimé-V1',
        },
        this.applyDocumentRaccordementSuppriméEventV1.bind(this),
      )
      .with(
        { type: 'DateMiseEnServiceTransmise-V1' },
        this.applyDateMiseEnServiceTransmiseEventV1.bind(this),
      )
      .with(
        { type: 'DateMiseEnServiceTransmise-V2' },
        this.applyDateMiseEnServiceTransmiseEventV2.bind(this),
      )
      .with(
        { type: P.union('DateMiseEnServiceModifiée-V1', 'DateMiseEnServiceModifiée-V2') },
        this.applyDateMiseEnServiceModifiéeEvent.bind(this),
      )
      .with(
        {
          type: P.union(
            'GestionnaireRéseauRaccordementModifié-V2',
            'GestionnaireRéseauRaccordementModifié-V1',
          ),
        },
        this.applyGestionnaireRéseauRaccordementModifiéEvent.bind(this),
      )
      .with(
        { type: 'GestionnaireRéseauInconnuAttribué-V1' },
        this.applyGestionnaireRéseauRaccordemenInconnuEventV1.bind(this),
      )
      .with(
        { type: 'GestionnaireRéseauAttribué-V1' },
        this.applyAttribuerGestionnaireRéseauEventV1.bind(this),
      )
      .with(
        { type: 'DossierDuRaccordementSupprimé-V1' },
        this.applyDossierDuRaccordementSuppriméEventV1.bind(this),
      )
      .with(
        { type: 'DossierDuRaccordementSupprimé-V2' },
        this.applyDossierDuRaccordementSuppriméEventV2.bind(this),
      )
      .with({ type: 'RaccordementSupprimé-V1' }, this.applyRaccordementSuppriméEventV1.bind(this))
      .with(
        { type: 'DateMiseEnServiceSupprimée-V1' },
        this.applyDateMiseEnServiceSuppriméeEventV1.bind(this),
      )
      .with({ type: 'RaccordementRéactivé-V1' }, this.applyRaccordementReactivéEventV1.bind(this))
      .exhaustive();
  }
}
