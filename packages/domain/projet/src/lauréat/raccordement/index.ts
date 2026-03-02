import {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
} from './consulter/consulterDossierRaccordement.query.js';
import {
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
} from './consulter/consulterGestionnaireRéseauRaccordement.query.js';
import {
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
} from './consulter/consulterNombreRaccordement.js';
import {
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
} from './consulter/consulterRaccordement.query.js';
import {
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
} from './lister/listerDossierRaccordement.query.js';
import {
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
} from './lister/listerDossierRaccordementEnAttenteMiseEnService.query.js';
import {
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
} from './lister/listerDossierRaccordementManquants.query.js';
import {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query.js';
import { ModifierDateMiseEnServiceUseCase } from './modifier/dateMiseEnService/modifierDateMiseEnService.usecase.js';
import { ModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase.js';
import { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase.js';
import { ModifierPropositionTechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositionTechniqueEtFinancière.usecase.js';
import { ModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase.js';
import {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './rechercher/rechercherDossierRaccordement.query.js';
import { SupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase.js';
import { SupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase.js';
import { TransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase.js';
import { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase.js';
import { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase.js';

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

export type {
  ConsulterDossierRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementQuery,
  RechercherDossierRaccordementQuery,
  ConsulterNombreDeRaccordementQuery,
  ConsulterRaccordementQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementManquantsQuery,
  ListerHistoriqueRaccordementProjetQuery,
};

// ReadModel
export type {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetReadModel,
  ConsulterRaccordementReadModel,
  ConsulterDossierRaccordementReadModel,
  ConsulterGestionnaireRéseauRaccordementReadModel,
  ConsulterNombreDeRaccordementReadModel,
  RechercherDossierRaccordementReadModel,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
  ListerDossierRaccordementReadModel,
  ListerDossierRaccordementManquantsReadModel,
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

export type {
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierGestionnaireRéseauRaccordementUseCase,
  ModifierPropositionTechniqueEtFinancièreUseCase,
  ModifierRéférenceDossierRaccordementUseCase,
  ModifierDateMiseEnServiceUseCase,
  TransmettreDateMiseEnServiceUseCase,
  TransmettreDemandeComplèteRaccordementUseCase,
  TransmettrePropositionTechniqueEtFinancièreUseCase,
  SupprimerDossierDuRaccordementUseCase,
  SupprimerDateMiseEnServiceUseCase,
};

// Events
export type * from './raccordement.event.js';

// Entities
export type * from './raccordement.entity.js';
export type * from './dossierRaccordement.entity.js';

// Value types
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType.js';
export * as TypeDocumentRaccordement from './typeDocumentRaccordement.valueType.js';
export * as TypeTâchePlanifiéeRaccordement from './typeTâchePlanifiéeRaccordement.valueType.js';

// Saga
export * as RaccordementSaga from './saga/raccordement.saga.js';
