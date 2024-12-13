import {
  ConsulterActionnaireQuery,
  ConsulterActionnaireReadModel,
} from './consulter/consulterActionnaire.query';
import {
  ConsulterChangementActionnaireQuery,
  ConsulterChangementActionnaireReadModel,
} from './consulterChangement/consulterChangementActionnaire.query';
import { DemanderChangementUseCase } from './demanderChangement/demandeChangement.usecase';
import { ImporterActionnaireCommand } from './importer/importerActionnaire.command';
import { ModifierActionnaireCommand } from './modifier/modifierActionnaire.command';
import { ModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';

// Query
export type ActionnaireQuery = ConsulterActionnaireQuery | ConsulterChangementActionnaireQuery;
export type { ConsulterActionnaireQuery, ConsulterChangementActionnaireQuery };

// ReadModel
export type { ConsulterActionnaireReadModel, ConsulterChangementActionnaireReadModel };

// UseCase
export type ActionnaireUseCase = ModifierActionnaireUseCase | DemanderChangementUseCase;
export type { ModifierActionnaireUseCase, DemanderChangementUseCase };

// Command
export type ActionnaireCommand = ImporterActionnaireCommand | ModifierActionnaireCommand;
export type { ImporterActionnaireCommand, ModifierActionnaireCommand };

// Event
export type { ActionnaireEvent } from './actionnaire.aggregate';
export type { ChangementActionnaireDemandéEvent } from './demanderChangement/demandeChangement.behavior';

// Saga
export * as ActionnaireSaga from './actionnaire.saga';

// ValueType
export * as StatutChangementActionnaire from './statutChangementActionnaire.valueType';
export * as TypeDocumentActionnaire from './typeDocumentActionnaire.valueType';

// Entities
export * from './demandeChangementActionnaire.entity';
