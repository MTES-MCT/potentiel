import { registerArchiverÉliminéCommand } from './archiver/archiverÉliminé.command';
import {
  ConsulterÉliminéDependencies,
  registerConsulterÉliminéQuery,
} from './consulter/consulterÉliminé.query';
import {
  ListerÉliminéDependencies,
  registerListerÉliminéQuery,
} from './lister/listerÉliminé.query';
import { registerNotifierÉliminéCommand } from './notifier/notifierÉliminé.command';
import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register';

export type EliminéQueryDependencies = ConsulterÉliminéDependencies &
  ListerÉliminéDependencies &
  RecoursQueryDependencies;

export type EliminéCommandDependencies = RecoursCommandDependencies;

export const registerEliminéUseCases = (dependencies: EliminéCommandDependencies) => {
  registerArchiverÉliminéCommand(dependencies.getProjetAggregateRoot);
  registerNotifierÉliminéCommand(dependencies.getProjetAggregateRoot);

  registerRecoursUseCases(dependencies);
};

export const registerEliminéQueries = (dependencies: EliminéQueryDependencies) => {
  registerConsulterÉliminéQuery(dependencies);
  registerListerÉliminéQuery(dependencies);

  registerRecoursQueries(dependencies);
};
