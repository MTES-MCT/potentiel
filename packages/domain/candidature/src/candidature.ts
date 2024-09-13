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
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import type { CandidatureCorrigéeEvent } from './corriger/corrigerCandidature.behavior';
import {
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
} from './lister/listerCandidatures.query';

// Query
export type CandidatureQuery =
  | ConsulterProjetQuery
  | ListerCandidaturesQuery
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
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
};

// UseCases
export type CandidatureUseCase = ImporterCandidatureUseCase | CorrigerCandidatureUseCase;
export { ImporterCandidatureUseCase, CorrigerCandidatureUseCase };

// Events
export type CandidatureEvent = CandidatureImportéeEvent | CandidatureCorrigéeEvent;

export { CandidatureImportéeEvent, CandidatureCorrigéeEvent };

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

// Value Types
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';

// Aggregate
export * as Aggregate from './candidature.aggregate';
