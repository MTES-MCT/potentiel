import {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
} from './consulter/consulterDossierRaccordement.query';
import {
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
} from './consulter/consulterGestionnaireRéseauRaccordement.query';
import {
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
} from './consulter/consulterNombreRaccordement';
import {
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
} from './consulter/consulterRaccordement.query';
import { SupprimerDossierDuRaccordementUseCase } from './dossier/supprimer/supprimerDossierDuRaccordement.usecase';
import {
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
} from './lister/listerDossierRaccordement.query';
import {
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
} from './lister/listerDossierRaccordementEnAttenteMiseEnService.query';
import {
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
} from './lister/listerDossierRaccordementManquants.query';
import {
  ListerRaccordementQuery,
  ListerRaccordementReadModel,
} from './lister/listerRaccordement.query';
import { ModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/modifierGestionnaireRéseauRaccordement.usecase';
import { ModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { ModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';
import {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './rechercher/rechercherDossierRaccordement.query';
import { SupprimerDateMiseEnServiceUseCase } from './supprimer/supprimerDateMiseEnService.usecase';
import { TransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';

// Query
export type RaccordementQuery =
  | ConsulterRaccordementQuery
  | ConsulterDossierRaccordementQuery
  | ConsulterGestionnaireRéseauRaccordementQuery
  | ConsulterNombreDeRaccordementQuery
  | RechercherDossierRaccordementQuery
  | ListerRaccordementQuery
  | ListerDossierRaccordementEnAttenteMiseEnServiceQuery
  | ListerDossierRaccordementQuery
  | ListerDossierRaccordementManquantsQuery;

export type {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementQuery,
  RechercherDossierRaccordementQuery,
  ConsulterNombreDeRaccordementQuery,
  ConsulterRaccordementQuery,
  ListerRaccordementQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementManquantsQuery,
};

// ReadModel
export type {
  ConsulterRaccordementReadModel,
  ConsulterDossierRaccordementReadModel,
  ConsulterGestionnaireRéseauRaccordementReadModel,
  ConsulterNombreDeRaccordementReadModel,
  RechercherDossierRaccordementReadModel,
  ListerRaccordementReadModel,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
  ListerDossierRaccordementReadModel,
  ListerDossierRaccordementManquantsReadModel,
};

// UseCases
export type RaccordementUseCase =
  | ModifierDemandeComplèteRaccordementUseCase
  | ModifierGestionnaireRéseauRaccordementUseCase
  | ModifierPropositiontechniqueEtFinancièreUseCase
  | ModifierRéférenceDossierRaccordementUseCase
  | TransmettreDateMiseEnServiceUseCase
  | TransmettreDemandeComplèteRaccordementUseCase
  | TransmettrePropositionTechniqueEtFinancièreUseCase
  | SupprimerDossierDuRaccordementUseCase
  | SupprimerDateMiseEnServiceUseCase;

export type {
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierGestionnaireRéseauRaccordementUseCase,
  ModifierPropositiontechniqueEtFinancièreUseCase,
  ModifierRéférenceDossierRaccordementUseCase,
  TransmettreDateMiseEnServiceUseCase,
  TransmettreDemandeComplèteRaccordementUseCase,
  TransmettrePropositionTechniqueEtFinancièreUseCase,
  SupprimerDossierDuRaccordementUseCase,
  SupprimerDateMiseEnServiceUseCase,
};

// Event
export type { RaccordementEvent } from './raccordement.aggregate';
export type {
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
} from './modifier/modifierDemandeComplèteRaccordement.behavior';
export type {
  RéférenceDossierRacordementModifiéeEvent,
  RéférenceDossierRacordementModifiéeEventV1,
} from './modifier/modifierRéférenceDossierRaccordement.behavior';
export type {
  GestionnaireRéseauRaccordementModifiéEvent,
  GestionnaireRéseauProjetModifiéEvent,
} from './modifier/modifierGestionnaireRéseauRaccordement.behavior';
export type {
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
} from './modifier/modifierPropositiontechniqueEtFinancière.behavior';
export type {
  DateMiseEnServiceTransmiseEvent,
  DateMiseEnServiceTransmiseV1Event,
} from './transmettre/transmettreDateMiseEnService.behavior';
export type {
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DemandeComplèteRaccordementTransmiseEventV1,
  DemandeComplèteRaccordementTransmiseEventV2,
  DemandeComplèteRaccordementTransmiseEvent,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
export type {
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';
export type {
  GestionnaireRéseauAttribuéEvent,
  GestionnaireRéseauInconnuAttribuéEvent,
} from './attribuer/attribuerGestionnaireRéseau.behavior';
export type { DateMiseEnServiceSuppriméeEvent } from './supprimer/supprimerDateMiseEnService.behavior';
export type { DossierDuRaccordementSuppriméEvent } from './dossier/supprimer/supprimerDossierDuRaccordement.behavior';
export type { RaccordementSuppriméEvent } from './supprimer/supprimerRaccordement.behavior';

// ValueTypes
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
export * as TypeDocumentRaccordement from './typeDocumentRaccordement.valueType';

// Saga
export * as RaccordementSaga from './raccordement.saga';
export { RécupererGRDParVillePort } from './raccordement.saga';
