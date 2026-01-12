import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port';

import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';
import { registerConsulterDétailCandidatureQuery } from './détail/consulter/consulterDétailCandidature.query';

export type CandiatureCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export type CandidatureQueryDependencies = ListerProjetsEligiblesPreuveRecanditureDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerConsulterDétailCandidatureQuery(dependencies);
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
