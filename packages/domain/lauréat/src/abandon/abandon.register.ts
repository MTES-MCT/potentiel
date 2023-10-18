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
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query';
import {
  ConsulterPièceJustificativeAbandonProjetDependencies,
  registerConsulterPièceJustificativeAbandonProjetQuery,
} from './consulter/consulterPièceJustificativeAbandon.query';
import {
  ConsulterRéponseSignéeAbandonDependencies,
  registerConsulterRéponseAbandonSignéeQuery,
} from './consulter/consulterRéponseSignéeAbandon.query';
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
  ListerAbandonDependencies,
  registerListerAbandonQuery,
} from './lister/listerAbandon.query';
import {
  RejeterAbandonDependencies,
  registerRejeterAbandonCommand,
} from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';

export type AbandonUseCaseDependencies = AccorderAbandonDependencies &
  ConfirmerAbandonDependencies &
  DemanderAbandonDependencies &
  DemanderConfirmationAbandonDependencies &
  RejeterAbandonDependencies;

export type AbandonQueryDependencies = ConsulterAbandonDependencies &
  ConsulterPièceJustificativeAbandonProjetDependencies &
  ConsulterRéponseSignéeAbandonDependencies &
  ListerAbandonDependencies;

export const registerAbandonUseCases = (dependencies: AbandonUseCaseDependencies) => {
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

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
  registerConsulterPièceJustificativeAbandonProjetQuery(dependencies);
  registerConsulterRéponseAbandonSignéeQuery(dependencies);
};
