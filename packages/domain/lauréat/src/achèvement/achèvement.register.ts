import { LoadAggregate } from '@potentiel-domain/core';

import { registerModifierAttestationConformitéCommand } from './modifier/modifierAttestationConformité.command';
import { registerModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';

export type AchèvementCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerAchèvementUseCases = ({ loadAggregate }: AchèvementCommandDependencies) => {
  registerModifierAttestationConformitéCommand(loadAggregate);
  registerModifierAttestationConformitéUseCase();
};
