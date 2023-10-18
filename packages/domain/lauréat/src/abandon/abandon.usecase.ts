import { AccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { AnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { AnnulerRejetAbandonUseCase } from './annuler/annulerRejetAbandon.usecase';
import { ConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import { DemanderAbandonAvecRecandidatureUseCase } from './demander/demanderAbandon.usecase';
import { DemanderConfirmationAbandonUseCase } from './demander/demanderConfirmationAbandon.usecase';
import { RejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonUseCase =
  | DemanderAbandonAvecRecandidatureUseCase
  | AnnulerAbandonUseCase
  | AnnulerRejetAbandonUseCase
  | RejeterAbandonUseCase
  | AccorderAbandonUseCase
  | DemanderConfirmationAbandonUseCase
  | ConfirmerAbandonUseCase;

export {
  DemanderAbandonAvecRecandidatureUseCase,
  AnnulerAbandonUseCase,
  AnnulerRejetAbandonUseCase,
  RejeterAbandonUseCase,
  AccorderAbandonUseCase,
  DemanderConfirmationAbandonUseCase,
  ConfirmerAbandonUseCase,
};
