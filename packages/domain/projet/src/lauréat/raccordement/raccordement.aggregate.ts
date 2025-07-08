import { match, P } from 'ts-pattern';

import { AbstractAggregate, AggregateType, LoadAggregateV2 } from '@potentiel-domain/core';
import { DateTime } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseauAggregate } from '@potentiel-domain/reseau/dist/gestionnaire/gestionnaireRéseau.aggregate';

import { IdentifiantProjet } from '../..';
import { LauréatAggregate } from '../lauréat.aggregate';

import {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DateMiseEnServiceSuppriméeEvent,
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseV1Event,
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseEventV1,
  DemandeComplèteRaccordementTransmiseEventV2,
  DossierDuRaccordementSuppriméEvent,
  GestionnaireRéseauAttribuéEvent,
  GestionnaireRéseauInconnuAttribuéEvent,
  GestionnaireRéseauRaccordementModifiéEvent,
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
  RaccordementSuppriméEvent,
  RéférenceDossierRaccordement,
  RéférenceDossierRacordementModifiéeEvent,
  RéférenceDossierRacordementModifiéeEventV1,
} from '.';

import {
  DateDansLeFuturError,
  DateIdentiqueDeMiseEnServiceDéjàTransmiseError,
  DateMiseEnServiceAntérieureDateDésignationProjetError,
  DemandeComplèteRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError,
  DossierAvecDateDeMiseEnServiceNonSupprimableError,
  DossierNonRéférencéPourLeRaccordementDuProjetError,
  DossierRaccordementPasEnServiceError,
  FormatRéférenceDossierRaccordementInvalideError,
  GestionnaireRéseauIdentiqueError,
  GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError,
  GestionnaireRéseauDéjàExistantError,
  RéférenceDossierRaccordementDéjàExistantePourLeProjetError,
  RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError,
  RéférencesDossierRaccordementIdentiquesError,
} from './errors';
import { TransmettrePropositionTechniqueEtFinancièreOptions } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.options';
import { TransmettreDemandeOptions } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.options';
import { TransmettreDateMiseEnServiceOptions } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.options';
import { SupprimerDateMiseEnServiceOptions } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.options';
import { ModifierRéférenceDossierRaccordementOptions } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.options';
import { ModifierGestionnaireRéseauOptions } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseau.options';
import { SupprimerDossierDuRaccordementOptions } from './supprimer/dossier/supprimerDossierDuRaccordement.options';
import { AttribuerGestionnaireRéseauOptions } from './attribuer/attribuerGestionnaireRéseau.options';
import { ModifierDemandeComplèteOptions } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.options';
import { ModifierPropositionTechniqueEtFinancièreOptions } from './modifier/propositionTechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.options';

export type DeprecateEvent =
  | DemandeComplèteRaccordementTransmiseEventV1
  | DemandeComplèteRaccordementTransmiseEventV2
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
  | DemandeComplèteRaccordementModifiéeEventV1
  | DemandeComplèteRaccordementModifiéeEventV2
  | PropositionTechniqueEtFinancièreModifiéeEventV1
  | DateMiseEnServiceTransmiseV1Event
  | RéférenceDossierRacordementModifiéeEventV1;

export type RaccordementEvent =
  | DeprecateEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | DateMiseEnServiceTransmiseEvent
  | DateMiseEnServiceSuppriméeEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | RéférenceDossierRacordementModifiéeEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | GestionnaireRéseauRaccordementModifiéEvent
  | GestionnaireRéseauInconnuAttribuéEvent
  | GestionnaireRéseauAttribuéEvent
  | DossierDuRaccordementSuppriméEvent
  | RaccordementSuppriméEvent;

type DossierRaccordement = {
  référence: RéférenceDossierRaccordement.ValueType;
  demandeComplèteRaccordement: {
    dateQualification: Option.Type<DateTime.ValueType>;
    format: Option.Type<string>;
  };
  miseEnService: {
    dateMiseEnService: Option.Type<DateTime.ValueType>;
  };
  propositionTechniqueEtFinancière: {
    dateSignature: Option.Type<DateTime.ValueType>;
    format: Option.Type<string>;
  };
};

export class RaccordementAggregate extends AbstractAggregate<
  RaccordementEvent,
  'raccordement',
  LauréatAggregate
> {
  #gestionnaireRéseau!: AggregateType<GestionnaireRéseauAggregate>;
  #dossiers: Map<string, DossierRaccordement> = new Map();
  #identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;

  get lauréat() {
    return this.parent;
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

  private aUneDateDeMiseEnService(): boolean {
    for (const [, dossier] of this.#dossiers.entries()) {
      if (Option.isSome(dossier.miseEnService.dateMiseEnService)) {
        return true;
      }
    }
    return false;
  }

  private dateModifiée(
    { référence }: RéférenceDossierRaccordement.ValueType,
    date: DateTime.ValueType,
  ) {
    const dossier = this.récupérerDossier(référence);
    if (
      !dossier.miseEnService?.dateMiseEnService ||
      Option.isNone(dossier.miseEnService.dateMiseEnService)
    ) {
      return true;
    }
    return !date.estÉgaleÀ(dossier.miseEnService.dateMiseEnService);
  }

  async init(loadAggregate: LoadAggregateV2) {
    this.#gestionnaireRéseau = await loadAggregate(
      GestionnaireRéseauAggregate,
      `gestionnaire-réseau|${this.#identifiantGestionnaireRéseau.codeEIC}`,
      undefined,
    );
  }

  async attribuerGestionnaireRéseau({
    identifiantGestionnaireRéseau,
  }: AttribuerGestionnaireRéseauOptions) {
    const gestionnaireRéseauDéjàAttribué = !this.#identifiantGestionnaireRéseau.estÉgaleÀ(
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    );

    if (gestionnaireRéseauDéjàAttribué) {
      throw new GestionnaireRéseauDéjàExistantError(this.identifiantProjet.formatter());
    }

    if (
      identifiantGestionnaireRéseau.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
      )
    ) {
      const event: GestionnaireRéseauInconnuAttribuéEvent = {
        type: 'GestionnaireRéseauInconnuAttribué-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);
    } else {
      const event: GestionnaireRéseauAttribuéEvent = {
        type: 'GestionnaireRéseauAttribué-V1',
        payload: {
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);
    }
  }

  async supprimerDossier({ référenceDossier }: SupprimerDossierDuRaccordementOptions) {
    const dossierActuel = this.récupérerDossier(référenceDossier.formatter());

    if (Option.isSome(dossierActuel.miseEnService.dateMiseEnService)) {
      throw new DossierAvecDateDeMiseEnServiceNonSupprimableError();
    }

    const dossierDuRaccordementSupprimé: DossierDuRaccordementSuppriméEvent = {
      type: 'DossierDuRaccordementSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossier: référenceDossier.formatter(),
      },
    };

    await this.publish(dossierDuRaccordementSupprimé);
  }

  async modifierPropositionTechniqueEtFinancière({
    dateSignature,
    référenceDossierRaccordement,
    formatPropositionTechniqueEtFinancièreSignée,
  }: ModifierPropositionTechniqueEtFinancièreOptions) {
    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (!this.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
    }

    const event: PropositionTechniqueEtFinancièreModifiéeEvent = {
      type: 'PropositionTechniqueEtFinancièreModifiée-V2',
      payload: {
        dateSignature: dateSignature.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        propositionTechniqueEtFinancièreSignée: {
          format: formatPropositionTechniqueEtFinancièreSignée,
        },
      },
    };

    await this.publish(event);
  }

  async modifierDemandeComplèteRaccordement({
    dateQualification,
    formatAccuséRéception,
    référenceDossierRaccordement,
    rôle,
  }: ModifierDemandeComplèteOptions) {
    if (dateQualification.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (!this.référenceDossierExpressionRegulière.valider(référenceDossierRaccordement.référence)) {
      throw new FormatRéférenceDossierRaccordementInvalideError();
    }

    const dossier = this.récupérerDossier(référenceDossierRaccordement.formatter());

    if (
      (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal)) &&
      Option.isSome(dossier.miseEnService.dateMiseEnService)
    ) {
      throw new DemandeComplèteRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError(
        référenceDossierRaccordement.formatter(),
      );
    }

    const demandeComplèteRaccordementModifiée: DemandeComplèteRaccordementModifiéeEvent = {
      type: 'DemandeComplèteRaccordementModifiée-V3',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        dateQualification: dateQualification.formatter(),
        accuséRéception: {
          format: formatAccuséRéception,
        },
      },
    };

    await this.publish(demandeComplèteRaccordementModifiée);
  }

  async transmettrePropositionTechniqueEtFinancière({
    dateSignature,
    référenceDossierRaccordement,
    formatPropositionTechniqueEtFinancièreSignée,
  }: TransmettrePropositionTechniqueEtFinancièreOptions) {
    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (!this.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
    }

    const event: PropositionTechniqueEtFinancièreTransmiseEvent = {
      type: 'PropositionTechniqueEtFinancièreTransmise-V2',
      payload: {
        dateSignature: dateSignature.formatter(),
        référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        identifiantProjet: this.identifiantProjet.formatter(),
        propositionTechniqueEtFinancièreSignée: {
          format: formatPropositionTechniqueEtFinancièreSignée,
        },
      },
    };

    await this.publish(event);
  }

  async transmettreDemandeComplèteDeRaccordement({
    dateQualification,
    référenceDossier,
    formatAccuséRéception,
    transmisePar,
    transmiseLe,
  }: TransmettreDemandeOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();
    this.lauréat.vérifierNonAbandonné();

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
  }

  async transmettreDateMiseEnService({
    dateMiseEnService,
    dateDésignation,
    référenceDossier,
    transmiseLe,
    transmisePar,
  }: TransmettreDateMiseEnServiceOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (dateMiseEnService.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    if (dateMiseEnService.estAntérieurÀ(dateDésignation)) {
      throw new DateMiseEnServiceAntérieureDateDésignationProjetError();
    }

    if (!this.contientLeDossier(référenceDossier)) {
      throw new DossierNonRéférencéPourLeRaccordementDuProjetError();
    }

    if (!this.dateModifiée(référenceDossier, dateMiseEnService)) {
      throw new DateIdentiqueDeMiseEnServiceDéjàTransmiseError();
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
  }

  async supprimerDateMiseEnService({
    référenceDossier,
    suppriméeLe,
    suppriméePar,
  }: SupprimerDateMiseEnServiceOptions) {
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

  async supprimerRaccordement() {
    const raccordementSupprimé: RaccordementSuppriméEvent = {
      type: 'RaccordementSupprimé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
      },
    };

    await this.publish(raccordementSupprimé);
  }

  async modifierRéférenceDossierRacordement({
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    modifiéeLe,
    modifiéePar,
    rôle,
  }: ModifierRéférenceDossierRaccordementOptions) {
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
      throw new RéférenceDossierRaccordementNonModifiableCarDossierAvecDateDeMiseEnServiceError(
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
  }

  async modifierGestionnaireRéseau({
    identifiantGestionnaireRéseau,
    rôle,
  }: ModifierGestionnaireRéseauOptions) {
    if (this.#identifiantGestionnaireRéseau.estÉgaleÀ(identifiantGestionnaireRéseau)) {
      throw new GestionnaireRéseauIdentiqueError(
        this.identifiantProjet,
        identifiantGestionnaireRéseau,
      );
    }

    if (
      this.aUneDateDeMiseEnService() &&
      (rôle.estÉgaleÀ(Role.porteur) || rôle.estÉgaleÀ(Role.dreal))
    ) {
      throw new GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError();
    }

    if (
      identifiantGestionnaireRéseau.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
      )
    ) {
      const event: GestionnaireRéseauInconnuAttribuéEvent = {
        type: 'GestionnaireRéseauInconnuAttribué-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
        },
      };

      await this.publish(event);
    } else {
      const event: GestionnaireRéseauRaccordementModifiéEvent = {
        type: 'GestionnaireRéseauRaccordementModifié-V1',
        payload: {
          identifiantProjet: this.identifiantProjet.formatter(),
          identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
        },
      };

      await this.publish(event);
    }
  }

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
        { type: 'DemandeComplèteRaccordementModifiée-V3' },
        this.applyDemandeComplèteRaccordementModifiéeEventV3.bind(this),
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
        { type: 'PropositionTechniqueEtFinancièreTransmise-V2' },
        this.applyPropositionTechniqueEtFinancièreTransmiseEventV2.bind(this),
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreModifiée-V1' },
        this.applyPropositionTechniqueEtFinancièreModifiéeEventV1.bind(this),
      )
      .with(
        { type: 'PropositionTechniqueEtFinancièreModifiée-V2' },
        this.applyPropositionTechniqueEtFinancièreModifiéeEventV2.bind(this),
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
        { type: 'GestionnaireRéseauRaccordementModifié-V1' },
        this.applyGestionnaireRéseauRaccordementModifiéEventV1.bind(this),
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
      .with({ type: 'RaccordementSupprimé-V1' }, this.applyRaccordementSuppriméEventV1.bind(this))
      .with(
        { type: 'DateMiseEnServiceSupprimée-V1' },
        this.applyDateMiseEnServiceSuppriméeEventV1.bind(this),
      )
      .exhaustive();
  }

  private applyAttribuerGestionnaireRéseauEventV1({
    payload: { identifiantGestionnaireRéseau },
  }: GestionnaireRéseauAttribuéEvent) {
    this.#identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      );
  }

  private applyDossierDuRaccordementSuppriméEventV1({
    payload,
  }: DossierDuRaccordementSuppriméEvent) {
    this.#dossiers.delete(payload.référenceDossier);
  }

  private applyPropositionTechniqueEtFinancièreModifiéeEventV1({
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreModifiéeEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.propositionTechniqueEtFinancière.dateSignature =
      DateTime.convertirEnValueType(dateSignature);
  }

  private applyPropositionTechniqueEtFinancièreModifiéeEventV2({
    payload: {
      dateSignature,
      propositionTechniqueEtFinancièreSignée: { format },
      référenceDossierRaccordement,
    },
  }: PropositionTechniqueEtFinancièreModifiéeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.propositionTechniqueEtFinancière.dateSignature =
      DateTime.convertirEnValueType(dateSignature);
    dossier.propositionTechniqueEtFinancière.format = format;
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

  private applyDemandeComplèteRaccordementModifiéeEventV3({
    payload: {
      accuséRéception: { format },
      dateQualification,
      référenceDossierRaccordement,
    },
  }: DemandeComplèteRaccordementModifiéeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.demandeComplèteRaccordement.dateQualification =
      DateTime.convertirEnValueType(dateQualification);
    dossier.demandeComplèteRaccordement.format = format;
  }

  private applyPropositionTechniqueEtFinancièreTransmiseEventV1({
    payload: { dateSignature, référenceDossierRaccordement },
  }: PropositionTechniqueEtFinancièreTransmiseEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.propositionTechniqueEtFinancière.dateSignature =
      DateTime.convertirEnValueType(dateSignature);
  }

  private applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1({
    payload: { référenceDossierRaccordement, format },
  }: PropositionTechniqueEtFinancièreSignéeTransmiseEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.propositionTechniqueEtFinancière.format = format;
  }

  private applyPropositionTechniqueEtFinancièreTransmiseEventV2({
    payload: {
      identifiantProjet,
      dateSignature,
      référenceDossierRaccordement,
      propositionTechniqueEtFinancièreSignée: { format },
    },
  }: PropositionTechniqueEtFinancièreTransmiseEvent) {
    this.applyPropositionTechniqueEtFinancièreTransmiseEventV1.bind(this)({
      type: 'PropositionTechniqueEtFinancièreTransmise-V1',
      payload: {
        dateSignature,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
    this.applyPropositionTechniqueEtFinancièreSignéeTransmiseEventV1.bind(this)({
      type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
      payload: {
        format,
        identifiantProjet,
        référenceDossierRaccordement,
      },
    });
  }

  private applyAccuséRéceptionDemandeComplèteRaccordementTransmisEventV1({
    payload: { référenceDossierRaccordement, format },
  }: AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);

    dossier.demandeComplèteRaccordement.format = format;
  }

  private applyDemandeComplèteDeRaccordementTransmiseEventV1({
    payload: { identifiantGestionnaireRéseau, référenceDossierRaccordement, dateQualification },
  }: DemandeComplèteRaccordementTransmiseEventV1) {
    if (
      this.#identifiantGestionnaireRéseau.estÉgaleÀ(
        GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
      )
    ) {
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
      propositionTechniqueEtFinancière: {
        dateSignature: Option.none,
        format: Option.none,
      },
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

  private applyRaccordementSuppriméEventV1() {
    this.#identifiantGestionnaireRéseau = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;
    this.#dossiers = new Map();
  }

  private applyDateMiseEnServiceSuppriméeEventV1({
    payload: { référenceDossierRaccordement },
  }: DateMiseEnServiceSuppriméeEvent) {
    const dossier = this.récupérerDossier(référenceDossierRaccordement);
    dossier.miseEnService = {
      dateMiseEnService: Option.none,
    };
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

  private applyGestionnaireRéseauRaccordementModifiéEventV1({
    payload: { identifiantGestionnaireRéseau },
  }: GestionnaireRéseauRaccordementModifiéEvent) {
    this.#identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      );
  }

  private applyGestionnaireRéseauRaccordemenInconnuEventV1(
    _: GestionnaireRéseauInconnuAttribuéEvent,
  ) {
    this.#identifiantGestionnaireRéseau = GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu;
  }
}
