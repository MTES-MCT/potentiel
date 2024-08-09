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
import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import type { CandidatureImportéeEvent } from './importer/importerCandidature.behavior';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';

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
  ListerProjetsQuery,
  ListerProjetsListItemReadModel,
  ListerProjetsReadModel,
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
};

// UseCases
export type CandidatureUseCase = ImporterCandidatureUseCase;
export { ImporterCandidatureUseCase };

export { CandidatureImportéeEvent };

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
export * from './candidature.entity';
