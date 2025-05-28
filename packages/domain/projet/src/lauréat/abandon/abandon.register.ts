import { GetProjetAggregateRoot } from '../..';

import { registerDemanderAbandonCommand } from './demander/demanderAbandon.command';
import { registerDemanderAbandonUseCase } from './demander/demanderAbandon.usecase';

export type AbandonQueryDependencies = {};
//ConsulterAbandonDependencies &
//ListerAbandonDependencies &
//ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies;

export type AbandonCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAbandonUseCases = ({ getProjetAggregateRoot }: AbandonCommandDependencies) => {
  registerDemanderAbandonCommand(getProjetAggregateRoot);
  registerDemanderAbandonUseCase();
};

export const registerAbandonQueries = (_dependencies: AbandonQueryDependencies) => {};
