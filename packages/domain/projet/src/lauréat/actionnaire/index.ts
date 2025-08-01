import { AccorderChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { AnnulerChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './changement/consulter/consulterChangementActionnaire.query';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementActionnaire.usecase';
import {
  ListerChangementActionnaireQuery,
  ListerChangementActionnaireReadModel,
} from './changement/lister/listerChangementActionnaire.query';
import { RejeterChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import { EnregistrerChangementActionnaireUseCase } from './changement/enregistrerChangement/enregistrerChangement.usecase';
import {
  ListerHistoriqueActionnaireProjetReadModel,
  HistoriqueActionnaireProjetListItemReadModel,
  ListerHistoriqueActionnaireProjetQuery,
} from './listerHistorique/listerHistoriqueActionnaireProjet.query';

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
export type { ActionnaireEvent } from './actionnaire.event';
export type { ActionnaireImportéEvent } from './importer/importerActionnaire.event';
export type { ActionnaireModifiéEvent } from './modifier/modifierActionnaire.event';
export type { ChangementActionnaireDemandéEvent } from './changement/demander/demanderChangementActionnaire.event';
export type { ChangementActionnaireAnnuléEvent } from './changement/annuler/annulerChangementActionnaire.event';
export type { ChangementActionnaireSuppriméEvent } from './changement/supprimer/supprimerChangementActionnaire.event';
export type { ChangementActionnaireEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangementActionnaire.event';
export type { ChangementActionnaireAccordéEvent } from './changement/accorder/accorderChangementActionnaire.event';
export type { ChangementActionnaireRejetéEvent } from './changement/rejeter/rejeterChangementActionnaire.event';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';
export * as InstructionChangementActionnaire from './instructionChangementActionnaire.valueType';

// Entities
export * from './actionnaire.entity';
export * from './changementActionnaire.entity';

// Events
export * from './actionnaire.event';
