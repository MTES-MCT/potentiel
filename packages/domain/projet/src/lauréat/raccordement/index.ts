import type {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
} from './consulter/consulterDossierRaccordement.query.js';
import type {
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
} from './consulter/consulterGestionnaireRéseauRaccordement.query.js';
import type {
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
} from './consulter/consulterNombreRaccordement.js';
import type {
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
} from './consulter/consulterRaccordement.query.js';
import type {
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
} from './lister/listerDossierRaccordement.query.js';
import type {
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
} from './lister/listerDossierRaccordementEnAttenteMiseEnService.query.js';
import type {
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
} from './lister/listerDossierRaccordementManquants.query.js';
import type {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query.js';
import type { ModifierDateMiseEnServiceUseCase } from './modifier/dateMiseEnService/modifierDateMiseEnService.usecase.js';
import type { ModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase.js';
import type { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase.js';
import type { ModifierPropositionTechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.usecase.js';
import type { ModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase.js';
import type {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './rechercher/rechercherDossierRaccordement.query.js';
import type { SupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase.js';
import type { SupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase.js';
import type { TransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase.js';
import type { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase.js';
import type { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase.js';

// Query
export type RaccordementQuery =
  | ConsulterRaccordementQuery
  | ConsulterDossierRaccordementQuery
  | ConsulterGestionnaireRéseauRaccordementQuery
  | ConsulterNombreDeRaccordementQuery
  | RechercherDossierRaccordementQuery
  | ListerDossierRaccordementEnAttenteMiseEnServiceQuery
  | ListerDossierRaccordementQuery
  | ListerDossierRaccordementManquantsQuery
  | ListerHistoriqueRaccordementProjetQuery;

// ReadModel
export type {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
  HistoriqueRaccordementProjetListItemReadModel,
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
};

// UseCases
export type RaccordementUseCase =
  | ModifierDemandeComplèteRaccordementUseCase
  | ModifierGestionnaireRéseauRaccordementUseCase
  | ModifierPropositionTechniqueEtFinancièreUseCase
  | ModifierRéférenceDossierRaccordementUseCase
  | ModifierDateMiseEnServiceUseCase
  | TransmettreDateMiseEnServiceUseCase
  | TransmettreDemandeComplèteRaccordementUseCase
  | TransmettrePropositionTechniqueEtFinancièreUseCase
  | SupprimerDossierDuRaccordementUseCase
  | SupprimerDateMiseEnServiceUseCase;

export * as DocumentRaccordement from './documentRaccordement.valueType.js';
export type * from './dossierRaccordement.entity.js';
// Entities
export type * from './raccordement.entity.js';
// Events
export type * from './raccordement.event.js';
// Value types
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType.js';
// Saga
export * as RaccordementSaga from './saga/raccordement.saga.js';
export * as TypeTâchePlanifiéeRaccordement from './typeTâchePlanifiéeRaccordement.valueType.js';
export type {
  ModifierDateMiseEnServiceUseCase,
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierGestionnaireRéseauRaccordementUseCase,
  ModifierPropositionTechniqueEtFinancièreUseCase,
  ModifierRéférenceDossierRaccordementUseCase,
  SupprimerDateMiseEnServiceUseCase,
  SupprimerDossierDuRaccordementUseCase,
  TransmettreDateMiseEnServiceUseCase,
  TransmettreDemandeComplèteRaccordementUseCase,
  TransmettrePropositionTechniqueEtFinancièreUseCase,
};
