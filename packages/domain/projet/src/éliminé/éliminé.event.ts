import type { ÉliminéArchivéEvent } from './archiver/éliminéArchivé.event';
import type { ÉliminéNotifiéEvent } from './notifier/éliminéNotifié.event';

export type ÉliminéEvent = ÉliminéNotifiéEvent | ÉliminéArchivéEvent;
