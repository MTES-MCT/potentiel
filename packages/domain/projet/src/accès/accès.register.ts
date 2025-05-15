import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port';

import { registerAutoriserAccèsProjetCommand } from './autoriser/autoriserAccèsProjet.command';
import { registerAutoriserAccèsProjetUseCase } from './autoriser/autoriserAccèsProjet.usecase';
import { registerRetirerAccèsProjetCommand } from './retirer/retirerAccèsProjet.command';
import { registerRetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import { registerRéclamerAccèsProjetCommand } from './réclamer/réclamerAccèsProjet.command';
import { registerRéclamerAccèsProjetUseCase } from './réclamer/réclamerAccèsProjet.usecase';

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

// export type AccèsQueryDependencies = ConsulterAttestationConformitéDependencies;

// export const registerAccèsQueries = (dependencies: AccèsQueryDependencies) => {
//   // registerConsulterAttestationConformitéQuery(dependencies);
// };
