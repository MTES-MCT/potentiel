import { registerArchiverÉliminéCommand } from './archiver/archiverÉliminé.command';
import { registerConsulterÉliminéQuery } from './consulter/consulterÉliminé.query';
import { registerNotifierÉliminéCommand } from './notifier/notifierÉliminé.command';
import { registerNotifierÉliminéUseCase } from './notifier/notifierÉliminé.usecase';
import {
  RecoursCommandDependencies,
  RecoursQueryDependencies,
  registerRecoursQueries,
  registerRecoursUseCases,
} from './recours/recours.register';

export type EliminéQueryDependencies = RecoursQueryDependencies;
export type EliminéCommandDependencies = RecoursCommandDependencies;

export const registerEliminéUseCases = (dependencies: EliminéCommandDependencies) => {
  registerArchiverÉliminéCommand(dependencies.loadAggregate);
  registerNotifierÉliminéCommand(dependencies.loadAggregate);
  registerNotifierÉliminéUseCase();

  registerRecoursUseCases(dependencies);
};

export const registerEliminéQueries = (dependencies: EliminéQueryDependencies) => {
  registerRecoursQueries(dependencies);
  registerConsulterÉliminéQuery(dependencies);
};
