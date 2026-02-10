import { AccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase.js';
import { AnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase.js';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query.js';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementActionnaire.usecase.js';
import {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query.js';
import { RejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase.js';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query.js';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase.js';
import { EnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase.js';
import {
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
  ListerHistoriqueActionnaireProjetQuery,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query.js';

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

// Event
export type { ActionnaireEvent } from './actionnaire.event.js';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.event.js';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event.js';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event.js';
export type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event.js';
export type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event.js';
export type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event.js';
export type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event.js';
export type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event.js';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType.js';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType.js';
export * as InstructionChangementActionnaire from './instructionChangementActionnaire.valueType.js';

// Entities
export type * from './actionnaire.entity.js';
export type * from './changementActionnaire.entity.js';

// Events
export type * from './actionnaire.event.js';
