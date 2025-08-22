import type { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port';
import {
  type ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command';
import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import {
  type ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import {
  type ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';

export type CandiatureCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export type CandidatureQueryDependencies = ListerProjetsEligiblesPreuveRecanditureDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerListerCandidaturesQuery(dependencies);
};

export const registerCandidaturesUseCases = ({
  getProjetAggregateRoot,
}: CandiatureCommandDependencies) => {
  registerImporterCandidatureCommand(getProjetAggregateRoot);
  registerCorrigerCandidatureCommand(getProjetAggregateRoot);
  registerNotifierCandidatureCommand(getProjetAggregateRoot);

  registerImporterCandidatureUseCase();
  registerCorrigerCandidatureUseCase();
  registerNotifierCandidatureUseCase();
};
