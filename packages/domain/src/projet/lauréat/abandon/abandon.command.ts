import { DemanderAbandonCommand } from './demander/demanderAbandon.command';
import { RejeterAbandonCommand } from './rejeter/rejeterAbandon.command';

export type AbandonCommand = DemanderAbandonCommand | RejeterAbandonCommand;
