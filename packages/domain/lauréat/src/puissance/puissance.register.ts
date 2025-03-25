import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterPuissanceCommand } from './importer/importerPuissance.command';
import {
  ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query';

export type PuissanceQueryDependencies = ConsulterPuissanceDependencies;

export type PuissanceCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerPuissanceUseCases = ({ loadAggregate }: PuissanceCommandDependencies) => {
  registerImporterPuissanceCommand(loadAggregate);
};

export const registerPuissanceQueries = (dependencies: PuissanceQueryDependencies) => {
  registerConsulterPuissanceQuery(dependencies);
};
