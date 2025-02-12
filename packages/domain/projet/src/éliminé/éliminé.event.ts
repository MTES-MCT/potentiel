import { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event';
import { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;
