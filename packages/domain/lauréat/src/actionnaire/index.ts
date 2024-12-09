import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import {
  ConsulterDemandeModificationActionnaireQuery,
  ConsulterDemandeModificationActionnaireReadModel,
} from './consulterDemande/consulterDemandeModificationActionnaire.query';
import { DemanderModificationUseCase } from './demanderModification/demandeModification.usecase';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

// Query
export type ActionnaireQuery =
  | ConsulterActionnaireQuery
  | ConsulterDemandeModificationActionnaireQuery;
export type { ConsulterActionnaireQuery, ConsulterDemandeModificationActionnaireQuery };

// ReadModel
export type { ConsulterActionnaireReadModel, ConsulterDemandeModificationActionnaireReadModel };

// UseCase
export type ActionnaireUseCase = ModifierActionnaireUseCase | DemanderModificationUseCase;
export type { ModifierActionnaireUseCase, DemanderModificationUseCase };

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

// Entities
export * from './demandeModificationActionnaire.entity';
