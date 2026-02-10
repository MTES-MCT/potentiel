import { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event.js';
import { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event.js';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;
