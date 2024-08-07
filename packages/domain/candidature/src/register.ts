import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import { ListerProjetsDependencies, registerProjetsQuery } from './lister/listerProjets.query';
import { registerInstruireCandidatureUseCase } from './instruire/instruireCandidature.usecase';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';

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

export const registerCandidaturesUseCases = (_: CandiatureUseCasesDependencies) => {
  registerInstruireCandidatureUseCase();
};
