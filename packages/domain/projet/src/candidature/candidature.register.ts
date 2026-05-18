import { GetProjetAggregateRoot } from '../getProjetAggregateRoot.port.js';
import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query.js';
import { registerCorrigerCandidatureCommand } from './corriger/corrigerCandidature.command.js';
import { registerCorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase.js';
import { registerConsulterDétailCandidatureQuery } from './détail/consulter/consulterDétailCandidature.query.js';
import { registerImporterCandidatureCommand } from './importer/importerCandidature.command.js';
import { registerImporterCandidatureUseCase } from './importer/importerCandidature.usecase.js';
import {
  ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query.js';
import {
  ListerDétailsFournisseurQueryDependencies,
  registerListerDétailsFournisseurQuery,
} from './lister/listerDétailsFournisseur.query.js';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query.js';
import { registerNotifierCandidatureCommand } from './notifier/notifierCandidature.command.js';
import { registerNotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase.js';

export type CandiatureCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export type CandidatureQueryDependencies = ListerProjetsEligiblesPreuveRecanditureDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies &
  ListerDétailsFournisseurQueryDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerConsulterDétailCandidatureQuery(dependencies);
  registerListerCandidaturesQuery(dependencies);
  registerListerDétailsFournisseurQuery(dependencies);
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
