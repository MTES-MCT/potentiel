import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query';
import { DemanderChangementCommand } from './changement/demander/demanderChangementPuissance.command';
import { DemanderChangementUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import { ImporterPuissanceCommand } from './importer/importerPuissance.command';
import { ModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';

// Query
export type PuissanceQuery = ConsulterPuissanceQuery;
export type { ConsulterPuissanceQuery };

// ReadModel
export type { ConsulterPuissanceReadModel };

// UseCase
export type PuissanceUseCase = ModifierPuissanceUseCase | DemanderChangementUseCase;
export type { ModifierPuissanceUseCase, DemanderChangementUseCase };

// Command
export type PuissanceCommand =
  | ImporterPuissanceCommand
  | ModifierPuissanceCommand
  | DemanderChangementCommand;
export type { ImporterPuissanceCommand, ModifierPuissanceCommand, DemanderChangementCommand };

// Event
export type { PuissanceEvent } from './puissance.aggregate';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.behavior';
export type { ChangementPuissanceDemandéEvent } from './changement/demander/demanderChangementPuissance.behavior';

// Entities
export * from './puissance.entity';
export * from './changement/changementPuissance.entity';

// ValueType
export * as StatutChangementPuissance from './valueType/statutChangementPuissance.valueType';
export * as TypeDocumentPuissance from './valueType/typeDocumentPuissance.valueType';
export * as RèglesRatioPuissance from './valueType/règlesRatioPuissance.valueType';

// Saga
export * as PuissanceSaga from './saga';
