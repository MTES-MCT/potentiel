import {
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierGestionnaireRéseauRaccordementUseCase,
  ModifierPropositiontechniqueEtFinancièreUseCase,
  ModifierRéférenceDossierRaccordementUseCase,
  TransmettreDateMiseEnServiceUseCase,
  TransmettreDemandeComplèteRaccordementUseCase,
  TransmettrePropositionTechniqueEtFinancièreUseCase,
  SupprimerDossierDuRaccordementUseCase,
  SupprimerDateMiseEnServiceUseCase,
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
  ListerRaccordementQuery,
  ListerRaccordementReadModel,
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './index copy';
import {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query';

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
  | ListerDossierRaccordementManquantsQuery
  | ListerHistoriqueRaccordementProjetQuery;

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

// Events
export * from './raccordement.event';

// Entities
export * from './raccordement.entity';

// Value types
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
