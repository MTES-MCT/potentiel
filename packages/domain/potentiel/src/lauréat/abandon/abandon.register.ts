import {
  AccorderAbandonDependencies,
  registerAccorderAbandonCommand,
} from './accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { registerAnnulerRejetAbandonUseCase } from './annuler/annulerRejetAbandon.usecase';
import {
  ConfirmerAbandonDependencies,
  registerConfirmerAbandonCommand,
} from './confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  DemanderAbandonDependencies,
  registerDemanderAbandonCommand,
} from './demander/demanderAbandon.command';
import { registerDemanderAbandonAvecRecandidatureUseCase } from './demander/demanderAbandon.usecase';
import {
  DemanderConfirmationAbandonDependencies,
  registerDemanderConfirmationAbandonCommand,
} from './demander/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demander/demanderConfirmationAbandon.usecase';
import {
  RejeterAbandonDependencies,
  registerRejeterAbandonCommand,
} from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonDependencies = AccorderAbandonDependencies &
  ConfirmerAbandonDependencies &
  DemanderAbandonDependencies &
  DemanderConfirmationAbandonDependencies &
  RejeterAbandonDependencies;

export const registerAbandonUseCases = (dependencies: AbandonDependencies) => {
  registerDemanderAbandonCommand(dependencies);
  registerAccorderAbandonCommand(dependencies);
  registerConfirmerAbandonCommand(dependencies);
  registerDemanderConfirmationAbandonCommand(dependencies);
  registerRejeterAbandonCommand(dependencies);
  registerAnnulerAbandonCommand(dependencies);

  registerDemanderAbandonAvecRecandidatureUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();
};
