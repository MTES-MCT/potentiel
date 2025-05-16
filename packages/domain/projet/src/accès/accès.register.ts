import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port';

import { registerAutoriserAccèsProjetCommand } from './autoriser/autoriserAccèsProjet.command';
import { registerAutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase';
import { ListerAccèsDependencies, registerListerAccèsQuery } from './lister/listerAccès.query';
import { registerRetirerAccèsProjetCommand } from './retirer/retirerAccèsProjet.command';
import { registerRetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import { registerRéclamerAccèsProjetCommand } from './réclamer/réclamerAccèsProjet.command';
import { registerRéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase';
import {
  registerVérifierAccèsProjetQuery,
  VérifierAccèsProjetDependencies,
} from './vérifier/vérifierAccèsProjet.query';

export type AccèsCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAccèsUseCases = (dependencies: AccèsCommandDependencies) => {
  registerAutoriserAccèsProjetCommand(dependencies.getProjetAggregateRoot);
  registerAutoriserAccèsProjetUseCase();

  registerRéclamerAccèsProjetCommand(dependencies.getProjetAggregateRoot);
  registerRéclamerAccèsProjetUseCase();

  registerRetirerAccèsProjetCommand(dependencies.getProjetAggregateRoot);
  registerRetirerAccèsProjetUseCase();
};

export type AccèsQueryDependencies = ListerAccèsDependencies & VérifierAccèsProjetDependencies;

export const registerAccèsQueries = (dependencies: AccèsQueryDependencies) => {
  registerListerAccèsQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);
};
