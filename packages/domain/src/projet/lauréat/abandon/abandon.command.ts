import { AccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { ConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { DemanderAbandonCommand } from './demander/demanderAbandon.command';
import { DemanderConfirmationAbandonCommand } from './demander/demanderConfirmationAbandon.command';
import { RejeterAbandonCommand } from './rejeter/rejeterAbandon.command';

export type AbandonCommand =
  | DemanderAbandonCommand
  | RejeterAbandonCommand
  | AccorderAbandonCommand
  | ConfirmerAbandonCommand
  | DemanderConfirmationAbandonCommand;
