import { ÉliminéNotifiéEvent } from './notifier/notifierÉliminé.behavior';
import { NotifierÉliminéUseCase } from './notifier/notifierÉliminé.usecase';
import {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
} from './consulter/consulterÉliminé.query';

export type ÉliminéEvent = ÉliminéNotifiéEvent;
export { ÉliminéNotifiéEvent };

export type ÉliminéUseCase = NotifierÉliminéUseCase;
export { NotifierÉliminéUseCase };

export { ÉliminéEntity } from './éliminé.entity';

export type ÉliminéQuery = ConsulterÉliminéQuery;
export { ConsulterÉliminéQuery, ConsulterÉliminéReadModel };
