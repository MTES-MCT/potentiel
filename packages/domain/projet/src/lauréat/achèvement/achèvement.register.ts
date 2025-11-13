import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterAchèvementDependencies,
  registerConsulterAchèvementQuery,
} from './consulter/consulterAchèvement.query';
import { registerModifierAttestationConformitéCommand } from './modifier/modifierAttestationConformité.command';
import { registerModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

export type AchèvementCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAchèvementUseCases = (dependencies: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreAttestationConformitéUseCase();

  registerModifierAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerModifierAttestationConformitéUseCase();
};

export type AchèvementQueryDependencies = ConsulterAchèvementDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAchèvementQuery(dependencies);
};
