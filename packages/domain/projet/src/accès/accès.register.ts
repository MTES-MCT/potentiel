import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port.js';

import { registerAutoriserAccèsProjetCommand } from './autoriser/autoriserAccèsProjet.command.js';
import { registerAutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase.js';
import {
  ConsulterAccèsDependencies,
  registerConsulterAccèsQuery,
} from './consulter/consulterAccès.query.js';
import { ListerAccèsDependencies, registerListerAccèsQuery } from './lister/listerAccès.query.js';
import {
  ListerProjetsÀRéclamerDependencies,
  registerListerProjetsÀRéclamerQuery,
} from './lister/listerProjetsÀRéclamer.query.js';
import { registerRemplacerAccèsProjetCommand } from './remplacer/remplacerAccèsProjet.command.js';
import { registerRemplacerAccèsProjetUseCase } from './remplacer/remplacerAccèsProjet.usecase.js';
import { registerRetirerAccèsProjetCommand } from './retirer/retirerAccèsProjet.command.js';
import { registerRetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase.js';
import { registerRéclamerAccèsProjetCommand } from './réclamer/réclamerAccèsProjet.command.js';
import { registerRéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase.js';
import {
  registerVérifierAccèsProjetQuery,
  VérifierAccèsProjetDependencies,
} from './vérifier/vérifierAccèsProjet.query.js';

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
