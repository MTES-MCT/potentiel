import type { AccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import type { AnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import type {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query';
import type { DemanderChangementUseCase } from './changement/demander/demanderChangementActionnaire.usecase';
import type { EnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import type {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query';
import type { RejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import type {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import type {
  HistoriqueActionnaireProjetListItemReadModel,
  ListerHistoriqueActionnaireProjetQuery,
  ListerHistoriqueActionnaireProjetReadModel,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query';
import type { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

// Query
export type ActionnaireQuery =
  | ConsulterActionnaireQuery
  | ConsulterChangementActionnaireQuery
  | ListerChangementActionnaireQuery
  | ListerHistoriqueActionnaireProjetQuery;
export type {
  ConsulterActionnaireQuery,
  ConsulterChangementActionnaireQuery,
  ListerChangementActionnaireQuery,
  ListerHistoriqueActionnaireProjetQuery,
};

// ReadModel
export type {
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
  ConsulterActionnaireReadModel,
  ConsulterChangementActionnaireReadModel,
  ListerChangementActionnaireReadModel,
};

// UseCase
export type ActionnaireUseCase =
  | ModifierActionnaireUseCase
  | DemanderChangementUseCase
  | AnnulerChangementActionnaireUseCase
  | AccorderChangementActionnaireUseCase
  | RejeterChangementActionnaireUseCase
  | EnregistrerChangementActionnaireUseCase;
export type {
  ModifierActionnaireUseCase,
  DemanderChangementUseCase,
  AnnulerChangementActionnaireUseCase,
  AccorderChangementActionnaireUseCase,
  RejeterChangementActionnaireUseCase,
  EnregistrerChangementActionnaireUseCase,
};

// Entities
export * from './actionnaire.entity';
// Event
export type { ActionnaireEvent } from './actionnaire.event';
// Events
export * from './actionnaire.event';
export type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event';
export type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event';
export type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event';
export type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event';
export type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event';
export * from './changementActionnaire.entity';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.event';
export * as InstructionChangementActionnaire from './instructionChangementActionnaire.valueType';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event';
// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';
