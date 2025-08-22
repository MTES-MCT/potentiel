import type {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
} from './consulter/consulterDossierRaccordement.query';
import type {
  ConsulterGestionnaireRéseauRaccordementQuery,
  ConsulterGestionnaireRéseauRaccordementReadModel,
} from './consulter/consulterGestionnaireRéseauRaccordement.query';
import type {
  ConsulterNombreDeRaccordementQuery,
  ConsulterNombreDeRaccordementReadModel,
} from './consulter/consulterNombreRaccordement';
import type {
  ConsulterRaccordementQuery,
  ConsulterRaccordementReadModel,
} from './consulter/consulterRaccordement.query';
import type {
  ListerDossierRaccordementQuery,
  ListerDossierRaccordementReadModel,
} from './lister/listerDossierRaccordement.query';
import type {
  ListerDossierRaccordementEnAttenteMiseEnServiceQuery,
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel,
} from './lister/listerDossierRaccordementEnAttenteMiseEnService.query';
import type {
  ListerDossierRaccordementManquantsQuery,
  ListerDossierRaccordementManquantsReadModel,
} from './lister/listerDossierRaccordementManquants.query';
import type {
  ListerRaccordementQuery,
  ListerRaccordementReadModel,
} from './lister/listerRaccordement.query';
import type {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query';
import type { ModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase';
import type { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase';
import type { ModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.usecase';
import type { ModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase';
import type {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './rechercher/rechercherDossierRaccordement.query';
import type { SupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase';
import type { SupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase';
import type { TransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase';
import type { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase';
import type { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase';

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

// Entities
export * from './raccordement.entity';
// Events
export * from './raccordement.event';
// Value types
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
// Saga
export * as RaccordementSaga from './saga';
export * as TypeDocumentRaccordement from './typeDocumentRaccordement.valueType';
