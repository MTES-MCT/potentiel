import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

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
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export type AchèvementQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAchèvementUseCases = ({
  loadAggregate,
  getProjetAggregateRoot,
}: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(loadAggregate, getProjetAggregateRoot);
  registerModifierAttestationConformitéCommand(loadAggregate);

  registerTransmettreAttestationConformitéUseCase();
  registerModifierAttestationConformitéUseCase();
};

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
