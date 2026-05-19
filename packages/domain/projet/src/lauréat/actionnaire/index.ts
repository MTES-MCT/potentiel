import type { AccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase.js';
import type { AnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase.js';
import type {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query.js';
import type { DemanderChangementUseCase } from './changement/demander/demanderChangementActionnaire.usecase.js';
import type { EnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import type {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query.js';
import type { RejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase.js';
import type {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query.js';
import type {
  HistoriqueActionnaireProjetListItemReadModel,
  ListerHistoriqueActionnaireProjetQuery,
  ListerHistoriqueActionnaireProjetReadModel,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query.js';
import type { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase.js';

// Query
export type ActionnaireQuery =
  | ConsulterActionnaireQuery
  | ConsulterChangementActionnaireQuery
  | ListerChangementActionnaireQuery
  | ListerHistoriqueActionnaireProjetQuery;

// ReadModel
export type {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
  ListerHistoriqueActionnaireProjetQuery,
  ListerHistoriqueActionnaireProjetReadModel,
};

// UseCase
export type ActionnaireUseCase =
  | ModifierActionnaireUseCase
  | DemanderChangementUseCase
  | AnnulerChangementActionnaireUseCase
  | AccorderChangementActionnaireUseCase
  | RejeterChangementActionnaireUseCase
  | EnregistrerChangementActionnaireUseCase;

// Entities
export type * from './actionnaire.entity.js';
// Events
export type * from './actionnaire.event.js';
// Event
export type { ActionnaireEvent } from './actionnaire.event.js';
export type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event.js';
export type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event.js';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event.js';
export type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event.js';
export type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event.js';
export type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event.js';
export type * from './changementActionnaire.entity.js';
export * as DocumentActionnaire from './documentActionnaire.valueType.js';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.event.js';
export * as InstructionChangementActionnaire from './instructionChangementActionnaire.valueType.js';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event.js';
// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType.js';
export type {
  AccorderChangementActionnaireUseCase,
  AnnulerChangementActionnaireUseCase,
  DemanderChangementUseCase,
  EnregistrerChangementActionnaireUseCase,
  ModifierActionnaireUseCase,
  RejeterChangementActionnaireUseCase,
};
