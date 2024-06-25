import { LoadAggregate } from '@potentiel-domain/core';

import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import {
  ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';
import { registerModifierAttestationConformitéCommand } from './modifier/modifierAttestationConformité.command';
import { registerModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';

export type AchèvementCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export type AchèvementQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAchèvementUseCases = ({ loadAggregate }: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(loadAggregate);
  registerModifierAttestationConformitéCommand(loadAggregate);

  registerTransmettreAttestationConformitéUseCase();
  registerModifierAttestationConformitéUseCase();
};

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
