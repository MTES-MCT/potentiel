import {
  ConsulterPuissanceQuery,
  ConsulterPuissanceReadModel,
} from './consulter/consulterPuissance.query';
import { ImporterPuissanceCommand } from './importer/importerPuissance.command';
import { ModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { ModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';

// Query
export type PuissanceQuery = ConsulterPuissanceQuery;
export type { ConsulterPuissanceQuery };

// ReadModel
export type { ConsulterPuissanceReadModel };

// UseCase
export type PuissanceUseCase = ModifierPuissanceUseCase;
export type { ModifierPuissanceUseCase };

// Command
export type PuissanceCommand = ImporterPuissanceCommand | ModifierPuissanceCommand;
export type { ImporterPuissanceCommand, ModifierPuissanceCommand };

// Event
export type { PuissanceEvent } from './puissance.aggregate';
export type { PuissanceImportéeEvent } from './importer/importerPuissance.behavior';
export type { PuissanceModifiéeEvent } from './modifier/modifierPuissance.behavior';

// Entities
export * from './puissance.entity';

// ValueType
export * as StatutChangementPuissance from './statutChangementPuissance.valueType';

// Saga
export * as PuissanceSaga from './saga';
