import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

import {
  ConsulterTypologieDuProjetDependencies,
  registerConsulterTypologieDuProjetQuery,
} from './consulter/consulterTypologieDuProjet.query';
import { registerModifierTypologieDuProjetCommand } from './modifier/modifierTypologieDuProjet.command';
import { registerModifierTypologieDuProjetUseCase } from './modifier/modifierTypologieDuProjet.usecase';

export type TypologieDuProjetQueryDependencies = ConsulterTypologieDuProjetDependencies;

export type TypologieDuProjetUseCaseDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerTypologieDuProjetUseCases = (
  dependencies: TypologieDuProjetUseCaseDependencies,
) => {
  registerModifierTypologieDuProjetCommand(dependencies.getProjetAggregateRoot);
  registerModifierTypologieDuProjetUseCase();
};

export const registerTypologieDuProjetQueries = (
  dependencies: TypologieDuProjetQueryDependencies,
) => {
  registerConsulterTypologieDuProjetQuery(dependencies);
};
