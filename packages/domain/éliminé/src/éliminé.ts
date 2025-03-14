import { ÉliminéNotifiéEvent } from './notifier/notifierÉliminé.behavior';
import { ÉliminéArchivéEvent } from './archiver/archiverÉliminé.behavior';
import { ÉliminéEvent } from './éliminé.aggregate';
import { NotifierÉliminéUseCase } from './notifier/notifierÉliminé.usecase';
import {
  ConsulterÉliminéQuery,
  ConsulterÉliminéReadModel,
} from './consulter/consulterÉliminé.query';

export { ÉliminéEvent, ÉliminéNotifiéEvent, ÉliminéArchivéEvent };

export type ÉliminéUseCase = NotifierÉliminéUseCase;
export { NotifierÉliminéUseCase };

export { ÉliminéEntity } from './éliminé.entity';

export type ÉliminéQuery = ConsulterÉliminéQuery;
export { ConsulterÉliminéQuery, ConsulterÉliminéReadModel };
