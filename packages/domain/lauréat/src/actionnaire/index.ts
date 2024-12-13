import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import {
  ConsulterModificationActionnaireQuery,
  ConsulterModificationActionnaireReadModel,
} from './consulterModification/consulterModificationActionnaire.query';
import { DemanderModificationUseCase } from './demanderModification/demandeModification.usecase';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

// Query
export type ActionnaireQuery = ConsulterActionnaireQuery | ConsulterModificationActionnaireQuery;
export type { ConsulterActionnaireQuery, ConsulterModificationActionnaireQuery };

// ReadModel
export type { ConsulterActionnaireReadModel, ConsulterModificationActionnaireReadModel };

// UseCase
export type ActionnaireUseCase = ModifierActionnaireUseCase | DemanderModificationUseCase;
export type { ModifierActionnaireUseCase, DemanderModificationUseCase };

// Command
export type ActionnaireCommand = ImporterActionnaireCommand | ModifierActionnaireCommand;
export type { ImporterActionnaireCommand, ModifierActionnaireCommand };

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';
export type { ModificationActionnaireDemandéeEvent } from './demanderModification/demandeModification.behavior';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutModificationActionnaire from './statutModificationActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './demandeModificationActionnaire.entity';
