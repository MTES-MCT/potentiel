import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterRecoursDependencies,
  registerConsulterRecoursQuery,
} from './consulter/consulterRecours.query';
// import { registerDemanderRecoursCommand } from './demander/demanderRecours.command';
// import { registerDemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import {
  ListerRecoursDependencies,
  registerListerRecoursQuery,
} from './lister/listerRecours.query';

export type RecoursQueryDependencies = ConsulterRecoursDependencies & ListerRecoursDependencies;
export type RecoursCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerRecoursUseCases = ({
  getProjetAggregateRoot: _getProjetAggregateRoot,
}: RecoursCommandDependencies) => {
  // registerDemanderRecoursCommand(getProjetAggregateRoot);
  // registerDemanderRecoursUseCase();
};

export const registerRecoursQueries = (dependencies: RecoursQueryDependencies) => {
  registerConsulterRecoursQuery(dependencies);
  registerListerRecoursQuery(dependencies);
};
