import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import {
  ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

export type AchèvementCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAchèvementUseCases = (dependencies: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreAttestationConformitéUseCase();
};

export type AchèvementQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
