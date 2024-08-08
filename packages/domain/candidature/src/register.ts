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

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerProjetsEligiblesPreuveRecanditureDependencies &
  ListerProjetsDependencies;

type CandiatureUseCasesDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerProjetsQuery(dependencies);
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
};

export const registerCandidaturesUseCases = ({ loadAggregate }: CandiatureUseCasesDependencies) => {
  registerImporterCandidatureCommand(loadAggregate);

  registerImporterCandidatureUseCase();
};
