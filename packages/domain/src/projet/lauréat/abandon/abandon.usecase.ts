import { AccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { ConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { DemanderAbandonAvecRecandidatureUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonCommand } from './demander/demanderConfirmationAbandon.command';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonUsecase =
  | DemanderAbandonAvecRecandidatureUseCase
  | RejeterAbandonUseCase
  | AccorderAbandonCommand
  | DemanderConfirmationAbandonCommand
  | ConfirmerAbandonCommand;
