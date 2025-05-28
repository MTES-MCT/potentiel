import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registerAnnulerAbandonCommand } from './annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { registerConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query';
import { registerDemanderConfirmationAbandonCommand } from './demanderConfirmation/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import {
  ListerAbandonDependencies,
  registerListerAbandonQuery,
} from './lister/listerAbandons.query';
import { registerRejeterAbandonCommand } from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import {
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies,
  registerListerAbandonsAvecRecandidatureÀRelancerQuery,
} from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import { registerPasserAbandonEnInstructionCommand } from './instruire/passerAbandonEnInstruction.command';
import { registerPasserEnInstructionAbandonUseCase } from './instruire/passerAbandonEnInstruction.usecase';

export type AbandonQueryDependencies = ConsulterAbandonDependencies &
  ListerAbandonDependencies &
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies;

export type AbandonCommandDependencies = {
  loadAggregate: LoadAggregate;
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAbandonUseCases = ({ loadAggregate }: AbandonCommandDependencies) => {
  registerConfirmerAbandonCommand(loadAggregate);
  registerDemanderConfirmationAbandonCommand(loadAggregate);
  registerRejeterAbandonCommand(loadAggregate);
  registerAnnulerAbandonCommand(loadAggregate);
  registerPasserAbandonEnInstructionCommand(loadAggregate);

  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerPasserEnInstructionAbandonUseCase();
};

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
  registerListerAbandonsAvecRecandidatureÀRelancerQuery(dependencies);
};
