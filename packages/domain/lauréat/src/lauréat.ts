import { LauréatModifiéEvent } from './modifier/modifierLauréat.behavior';
import { ModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { LauréatNotifiéEvent } from './notifier/notifierLauréat.behavior';
import { NotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
export { LauréatEntity } from './lauréat.entity';

export {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';

// Event
export type LauréatEvent = LauréatNotifiéEvent | LauréatModifiéEvent;
export { LauréatNotifiéEvent, LauréatModifiéEvent };

// UseCases
export type LauréatUseCases = NotifierLauréatUseCase | ModifierLauréatUseCase;
export { NotifierLauréatUseCase, ModifierLauréatUseCase };

// ValueType
export * as StatutLauréat from './statutLauréat.valueType';

// Saga
export * as LauréatSaga from './lauréat.saga';

// Aggregate
export { loadLauréatFactory } from './lauréat.aggregate';
