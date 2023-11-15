import { LoadAggregate } from '@potentiel-domain/core';
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
import { registerAnnulerRejetAbandonCommand } from './annuler/annulerRejetAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettre/transmettrePreuveRecandidatureAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettre/transmettrePreuveRecandidatureAbandon.usecase';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demander/demanderPreuveRecandidatureAbandon.command';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demander/demanderPreuveRecandidatureAbandon.usecase';

export type AbandonQueryDependencies = ConsulterAbandonDependencies & ListerAbandonDependencies;
export type AbandonCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerAbandonUseCases = ({ loadAggregate }: AbandonCommandDependencies) => {
  registerDemanderAbandonCommand(loadAggregate);
  registerAccorderAbandonCommand(loadAggregate);
  registerConfirmerAbandonCommand(loadAggregate);
  registerDemanderConfirmationAbandonCommand(loadAggregate);
  registerRejeterAbandonCommand(loadAggregate);
  registerAnnulerAbandonCommand(loadAggregate);
  registerAnnulerRejetAbandonCommand(loadAggregate);
  registerTransmettrePreuveRecandidatureAbandonCommand(loadAggregate);
  registerDemanderPreuveRecandidatureAbandonCommand(loadAggregate);

  registerDemanderAbandonUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();
  registerTransmettrePreuveRecandidatureAbandonUseCase();
  registerDemanderPreuveRecandidatureAbandonUseCase();
};

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
};
