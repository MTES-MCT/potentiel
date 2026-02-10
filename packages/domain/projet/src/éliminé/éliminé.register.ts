import {
  ConsulterÉliminéDependencies,
  registerConsulterÉliminéQuery,
} from './consulter/consulterÉliminé.query.js';
import {
  ListerÉliminéDependencies,
  registerListerÉliminéQuery,
} from './lister/listerÉliminé.query.js';
import {
  ListerÉliminéEnrichiDependencies,
  registerListerÉliminéEnrichiQuery,
} from './lister/listerÉliminéEnrichi.query.js';
import { registerNotifierÉliminéCommand } from './notifier/notifierÉliminé.command.js';
import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register.js';

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
