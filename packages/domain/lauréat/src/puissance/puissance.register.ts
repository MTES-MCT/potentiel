import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterPuissanceCommand } from './importer/importerPuissance.command';
import {
  ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';

export type PuissanceQueryDependencies = ConsulterPuissanceDependencies;

export type PuissanceCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerPuissanceUseCases = ({ loadAggregate }: PuissanceCommandDependencies) => {
  registerModifierPuissanceUseCase();

  registerImporterPuissanceCommand(loadAggregate);
  registerModifierPuissanceCommand(loadAggregate);
};

export const registerPuissanceQueries = (dependencies: PuissanceQueryDependencies) => {
  registerConsulterPuissanceQuery(dependencies);
};
