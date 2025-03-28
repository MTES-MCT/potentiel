import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterPuissanceCommand } from './importer/importerPuissance.command';
import {
  ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';
import { registerDemanderChangementPuissanceCommand } from './demander/demanderChangementPuissance.command';
import { registerDemanderChangementPuissanceUseCase } from './demander/demanderChangementPuissance.usecase';

export type PuissanceQueryDependencies = ConsulterPuissanceDependencies;

export type PuissanceCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerPuissanceUseCases = ({ loadAggregate }: PuissanceCommandDependencies) => {
  registerModifierPuissanceUseCase();
  registerDemanderChangementPuissanceUseCase();

  registerImporterPuissanceCommand(loadAggregate);
  registerModifierPuissanceCommand(loadAggregate);
  registerDemanderChangementPuissanceCommand(loadAggregate);
};

export const registerPuissanceQueries = (dependencies: PuissanceQueryDependencies) => {
  registerConsulterPuissanceQuery(dependencies);
};
