import { LoadAggregateDependencies } from '@potentiel-domain/common';
import { registerAccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { registerAnnulerRejetAbandonUseCase } from './annuler/annulerRejetAbandon.usecase';
import { registerConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query';
import { registerDemanderAbandonCommand } from './demander/demanderAbandon.command';
import { registerDemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from './demander/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demander/demanderConfirmationAbandon.usecase';
import {
  ListerAbandonDependencies,
  registerListerAbandonQuery,
} from './lister/listerAbandon.query';
import { registerRejeterAbandonCommand } from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonQueryDependencies = ConsulterAbandonDependencies & ListerAbandonDependencies;

export const registerAbandonUseCases = (dependencies: LoadAggregateDependencies) => {
  registerDemanderAbandonCommand(dependencies);
  registerAccorderAbandonCommand(dependencies);
  registerConfirmerAbandonCommand(dependencies);
  registerDemanderConfirmationAbandonCommand(dependencies);
  registerRejeterAbandonCommand(dependencies);
  registerAnnulerAbandonCommand(dependencies);

  registerDemanderAbandonUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();
};

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
};
