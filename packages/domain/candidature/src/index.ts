import {
  ConsulterProjetQuery,
  RécupérerProjetPort,
  ConsulterProjetReadModel,
} from './consulter/consulterProjet.query';
import {
  ListerProjetsEligiblesPreuveRecanditureQuery,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import {
  RécupérerProjetsPort,
  ListerProjetsQuery,
  ListerProjetsReadModel,
  ListerProjetsListItemReadModel,
} from './lister/listerProjets.query';
import { InstruireCandidatureUseCase } from './instruire/instruireCandidature.usecase';

// Query
export type CandidatureQuery =
  | ConsulterProjetQuery
  | ListerProjetsEligiblesPreuveRecanditureQuery
  | ListerProjetsQuery;

export {
  ConsulterProjetQuery,
  ListerProjetsEligiblesPreuveRecanditureQuery,
  ConsulterProjetReadModel,
  ListerProjetsEligiblesPreuveRecanditureReadModel,
  ListerProjetsQuery as ListerProjetsQuery,
  ListerProjetsListItemReadModel,
  ListerProjetsReadModel,
};

// UseCases
export type CandidatureUseCase = InstruireCandidatureUseCase;
export { InstruireCandidatureUseCase };

// Register
export * from './register';

// Port
export {
  RécupérerProjetPort,
  RécupérerProjetsEligiblesPreuveRecanditurePort,
  RécupérerProjetsPort,
};

// Entity
export * from './projet.entity';
