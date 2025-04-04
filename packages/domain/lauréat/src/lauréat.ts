import { LauréatModifiéEvent } from './modifier/modifierLauréat.behavior';
import { ModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/notifierLauréat.behavior';
import { NotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';
import { CahierDesChargesModifiéEvent } from './modifier/modifierCahierDesCharges.behavior';
import { ModifierCahierDesChargesUseCase } from './modifier/modifierCahierDesCharges.usecase';
export { LauréatEntity } from './lauréat.entity';

export {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';

// Event
export type LauréatEvent =
  | LauréatNotifiéEvent
  | LauréatNotifiéV1Event
  | NomEtLocalitéLauréatImportésEvent
  | LauréatModifiéEvent
  | CahierDesChargesModifiéEvent;

export {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
  LauréatModifiéEvent,
  CahierDesChargesModifiéEvent,
};

// UseCases
export type LauréatUseCases =
  | NotifierLauréatUseCase
  | ModifierLauréatUseCase
  | ModifierCahierDesChargesUseCase;
export { NotifierLauréatUseCase, ModifierLauréatUseCase, ModifierCahierDesChargesUseCase };

// ValueType
export * as StatutLauréat from './statutLauréat.valueType';

// Saga
export * as LauréatSaga from './lauréat.saga';

// Aggregate
export { loadLauréatFactory } from './lauréat.aggregate';
