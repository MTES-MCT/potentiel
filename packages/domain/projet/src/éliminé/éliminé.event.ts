import type { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event.js';
import type { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event.js';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;
