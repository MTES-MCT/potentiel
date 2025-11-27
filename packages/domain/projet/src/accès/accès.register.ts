import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port';

import { registerAutoriserAccèsProjetCommand } from './autoriser/autoriserAccèsProjet.command';
import { registerAutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase';
import {
  ConsulterAccèsDependencies,
  registerConsulterAccèsQuery,
} from './consulter/consulterAccès.query';
import { ListerAccèsDependencies, registerListerAccèsQuery } from './lister/listerAccès.query';
import {
  ListerProjetsÀRéclamerDependencies,
  registerListerProjetsÀRéclamerQuery,
} from './lister/listerProjetsÀRéclamer.query';
import { registerRemplacerAccèsProjetCommand } from './remplacer/remplacerAccèsProjet.command';
import { registerRemplacerAccèsProjetUseCase } from './remplacer/remplacerAccèsProjet.usecase';
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

  registerRemplacerAccèsProjetCommand(dependencies.getProjetAggregateRoot);
  registerRemplacerAccèsProjetUseCase();
};

export type AccèsQueryDependencies = ListerAccèsDependencies &
  ListerProjetsÀRéclamerDependencies &
  VérifierAccèsProjetDependencies &
  ConsulterAccèsDependencies;

export const registerAccèsQueries = (dependencies: AccèsQueryDependencies) => {
  registerListerAccèsQuery(dependencies);
  registerListerProjetsÀRéclamerQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);
  registerConsulterAccèsQuery(dependencies);
};
