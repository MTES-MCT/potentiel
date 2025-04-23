import {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';
import { ModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { NotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';

// Query
export type LauréatQuery = ConsulterLauréatQuery;
export { ConsulterLauréatQuery };

// ReadModel
export { ConsulterLauréatReadModel };

// Port

// UseCases
export type LauréatUseCase = NotifierLauréatUseCase | ModifierLauréatUseCase;
export { NotifierLauréatUseCase, ModifierLauréatUseCase };

// Events
export { LauréatEvent } from './lauréat.event';
export {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
export { LauréatModifiéEvent } from './modifier/lauréatModifié.event';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register';

// Entities
export { LauréatEntity } from './lauréat.entity';

// ValueType
