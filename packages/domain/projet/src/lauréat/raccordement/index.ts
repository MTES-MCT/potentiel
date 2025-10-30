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
import {
  HistoriqueRaccordementProjetListItemReadModel,
  ListerHistoriqueRaccordementProjetQuery,
  ListerHistoriqueRaccordementProjetReadModel,
} from './listerHistorique/listerHistoriqueRaccordementProjet.query';
import { ModifierDemandeComplèteRaccordementUseCase } from './modifier/demandeComplète/modifierDemandeComplèteRaccordement.usecase';
import { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/gestionnaireRéseauDuRaccordement/modifierGestionnaireRéseauRaccordement.usecase';
import { ModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/propositionTechniqueEtFinancière/modifierPropositiontechniqueEtFinancière.usecase';
import { ModifierRéférenceDossierRaccordementUseCase } from './modifier/référenceDossierRaccordement/modifierRéférenceDossierRaccordement.usecase';
import {
  RechercherDossierRaccordementQuery,
  RechercherDossierRaccordementReadModel,
} from './rechercher/rechercherDossierRaccordement.query';
import { SupprimerDateMiseEnServiceUseCase } from './supprimer/dateMiseEnService/supprimerDateMiseEnService.usecase';
import { SupprimerDossierDuRaccordementUseCase } from './supprimer/dossier/supprimerDossierDuRaccordement.usecase';
import { TransmettreDateMiseEnServiceUseCase } from './transmettre/dateMiseEnService/transmettreDateMiseEnService.usecase';
import { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/demandeComplèteDeRaccordement/transmettreDemandeComplèteRaccordement.usecase';
import { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/propositionTechniqueEtFinancière/transmettrePropositionTechniqueEtFinancière.usecase';

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
export * as TypeDocumentRaccordement from './typeDocumentRaccordement.valueType';
export * as TypeTâchePlanifiéeRaccordement from './typeTâchePlanifiéeRaccordement.valueType';

// Saga
export * as RaccordementSaga from './saga/raccordement.saga';
