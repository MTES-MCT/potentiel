import {
  ConsulterÉliminéDependencies,
  registerConsulterÉliminéQuery,
} from './consulter/consulterÉliminé.query';
import {
  ListerÉliminéDependencies,
  registerListerÉliminéQuery,
} from './lister/listerÉliminé.query';
import {
  ListerÉliminéEnrichiDependencies,
  registerListerÉliminéEnrichiQuery,
} from './lister/listerÉliminéEnrichi.query';
import { registerNotifierÉliminéCommand } from './notifier/notifierÉliminé.command';
import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register';

export type EliminéQueryDependencies = ConsulterÉliminéDependencies &
  ListerÉliminéDependencies &
  RecoursQueryDependencies &
  ListerÉliminéEnrichiDependencies;

export type EliminéCommandDependencies = RecoursCommandDependencies;

export const registerEliminéUseCases = (dependencies: EliminéCommandDependencies) => {
  registerNotifierÉliminéCommand(dependencies.getProjetAggregateRoot);

  registerRecoursUseCases(dependencies);
};

export const registerEliminéQueries = (dependencies: EliminéQueryDependencies) => {
  registerConsulterÉliminéQuery(dependencies);
  registerListerÉliminéQuery(dependencies);
  registerListerÉliminéEnrichiQuery(dependencies);

  registerRecoursQueries(dependencies);
};
