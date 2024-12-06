import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

// Query
export type ActionnaireQuery = ConsulterActionnaireQuery;
export type { ConsulterActionnaireQuery };

// ReadModel
export type { ConsulterActionnaireReadModel };

// UseCase
export type ActionnaireUseCase = ModifierActionnaireUseCase;
export type { ModifierActionnaireUseCase };

// Command
export type ActionnaireCommand = ImporterActionnaireCommand | ModifierActionnaireCommand;
export type { ImporterActionnaireCommand, ModifierActionnaireCommand };

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutModificationActionnaire from './statutModificationActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';
