import type {
  ConsulterReprésentantLégalQuery,
  ConsulterReprésentantLégalReadModel,
} from './consulter/consulterReprésentantLégal.query';
import { ModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { ModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { ImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import { DemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import { DemanderChangementReprésentantLégalCommand } from './changement/demander/demanderChangementReprésentantLégal.command';
import { AccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
import { AccorderChangementReprésentantLégalCommand } from './changement/accorder/accorderChangementReprésentantLégal.command';
import { RejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
import { RejeterChangementReprésentantLégalCommand } from './changement/rejeter/rejeterChangementReprésentantLégal.command';
import {
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalReadModel,
} from './changement/consulter/consulterChangementReprésentantLégal.query';
import {
  ListerChangementReprésentantLégalQuery,
  ListerChangementReprésentantLégalReadModel,
} from './changement/lister/listerChangementReprésentantLégal.query';
import { AnnulerChangementReprésentantLégalCommand } from './changement/annuler/annulerChangementReprésentantLégal.command';
import { AnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
import { SupprimerDocumentProjetSensibleCommand } from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import { CorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import { CorrigerChangementReprésentantLégalCommand } from './changement/corriger/corrigerChangementReprésentantLégal.command';
import { ConsulterChangementReprésentantLégalEnCoursQuery } from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalEnCoursQuery
  | ListerChangementReprésentantLégalQuery;

export type {
  ConsulterReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalEnCoursQuery,
  ListerChangementReprésentantLégalQuery,
};

// ReadModel
export type {
  ConsulterReprésentantLégalReadModel,
  ConsulterChangementReprésentantLégalReadModel,
  ListerChangementReprésentantLégalReadModel,
};

// Command
export type ReprésentantLégalCommand =
  | ImporterReprésentantLégalCommand
  | ModifierReprésentantLégalCommand
  | DemanderChangementReprésentantLégalCommand
  | AnnulerChangementReprésentantLégalCommand
  | CorrigerChangementReprésentantLégalCommand
  | AccorderChangementReprésentantLégalCommand
  | RejeterChangementReprésentantLégalCommand
  | SupprimerDocumentProjetSensibleCommand;

export type {
  ImporterReprésentantLégalCommand,
  ModifierReprésentantLégalCommand,
  DemanderChangementReprésentantLégalCommand,
  CorrigerChangementReprésentantLégalCommand,
  AccorderChangementReprésentantLégalCommand,
  RejeterChangementReprésentantLégalCommand,
};

// UseCase
export type ReprésentantLégalUseCase =
  | ModifierReprésentantLégalUseCase
  | DemanderChangementReprésentantLégalUseCase
  | AnnulerChangementReprésentantLégalUseCase
  | CorrigerChangementReprésentantLégalUseCase
  | AccorderChangementReprésentantLégalUseCase
  | RejeterChangementReprésentantLégalUseCase;

export type {
  ModifierReprésentantLégalUseCase,
  DemanderChangementReprésentantLégalUseCase,
  AnnulerChangementReprésentantLégalUseCase,
  CorrigerChangementReprésentantLégalUseCase,
  AccorderChangementReprésentantLégalUseCase,
  RejeterChangementReprésentantLégalUseCase,
};

// Event
export type { ReprésentantLégalEvent } from './représentantLégal.aggregate';

// Register
export {
  registerReprésentantLégalQueries,
  registerReprésentantLégalUseCases,
} from './représentantLégal.register';

// Entities
export * from './représentantLégal.entity';
export * from './changement/changementReprésentantLégal.entity';

// Aggregate
export { loadReprésentantLégalFactory } from './représentantLégal.aggregate';

// Saga
export * as ReprésentantLégalSaga from './saga';

// ValueType
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';

// Ports
export { type SupprimerDocumentProjetSensiblePort } from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
