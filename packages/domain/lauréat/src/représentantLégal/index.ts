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

// Query
export type ReprésentantLégalQuery =
  | ConsulterReprésentantLégalQuery
  | ConsulterChangementReprésentantLégalQuery
  | ListerChangementReprésentantLégalQuery;

export type {
  ConsulterReprésentantLégalQuery,
  ConsulterChangementReprésentantLégalQuery,
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
  | AccorderChangementReprésentantLégalCommand
  | RejeterChangementReprésentantLégalCommand;

export type {
  ImporterReprésentantLégalCommand,
  ModifierReprésentantLégalCommand,
  DemanderChangementReprésentantLégalCommand,
};

// UseCase
export type ReprésentantLégalUseCase =
  | ModifierReprésentantLégalUseCase
  | DemanderChangementReprésentantLégalUseCase
  | AnnulerChangementReprésentantLégalUseCase
  | AccorderChangementReprésentantLégalUseCase
  | RejeterChangementReprésentantLégalUseCase;

export type {
  ModifierReprésentantLégalUseCase,
  DemanderChangementReprésentantLégalUseCase,
  AnnulerChangementReprésentantLégalUseCase,
  AccorderChangementReprésentantLégalUseCase,
  RejeterChangementReprésentantLégalUseCase,
};

// Event
export type { ReprésentantLégalEvent } from './représentantLégal.aggregate';
export type { ReprésentantLégalImportéEvent } from './importer/importerReprésentantLégal.behavior';
export type { ReprésentantLégalModifiéEvent } from './modifier/modifierReprésentantLégal.behavior';
export type { ChangementReprésentantLégalDemandéEvent } from './changement/demander/demanderChangementReprésentantLégal.behavior';
export type { ChangementReprésentantLégalAnnuléEvent } from './changement/annuler/annulerChangementReprésentantLégal.behavior';
export type { ChangementReprésentantLégalAccordéEvent } from './changement/accorder/accorderChangementReprésentantLégal.behavior';
export type { ChangementReprésentantLégalRejetéEvent } from './changement/rejeter/rejeterChangementReprésentantLégal.behavior';
export type { ChangementReprésentantLégalSuppriméEvent } from './changement/supprimer/supprimerChangementReprésentantLégal.behavior';

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
export * as TypeReprésentantLégal from './typeReprésentantLégal.valueType';
export * as TypeDocumentChangementReprésentantLégal from './changement/typeDocumentChangementReprésentantLégal.valueType';
export * as TypeTâchePlanifiéeChangementReprésentantLégal from './changement/typeTâchePlanifiéeChangementReprésentantLégal.valueType';
export * as StatutChangementReprésentantLégal from './changement/statutChangementReprésentantLégal.valueType';
