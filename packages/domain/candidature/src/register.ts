import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import { ListerProjetsDependencies, registerProjetsQuery } from './lister/listerProjets.query';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerProjetsEligiblesPreuveRecanditureDependencies &
  ListerProjetsDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerProjetsQuery(dependencies);
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
};
