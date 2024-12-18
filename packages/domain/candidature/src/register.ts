import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import { ListerProjetsDependencies, registerProjetsQuery } from './lister/listerProjets.query';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command';
import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import {
  ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';
import { registerConsulterRésuméCandidatureQuery } from './consulter/consulterRésuméCandidature.query';

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerProjetsEligiblesPreuveRecanditureDependencies &
  ListerProjetsDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies;

type CandiatureUseCasesDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerProjetsQuery(dependencies);
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterRésuméCandidatureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerListerCandidaturesQuery(dependencies);
};

export const registerCandidaturesUseCases = ({ loadAggregate }: CandiatureUseCasesDependencies) => {
  registerImporterCandidatureCommand(loadAggregate);
  registerCorrigerCandidatureCommand(loadAggregate);
  registerNotifierCandidatureCommand(loadAggregate);

  registerImporterCandidatureUseCase();
  registerCorrigerCandidatureUseCase();
  registerNotifierCandidatureUseCase();
};
