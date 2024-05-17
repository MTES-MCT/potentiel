import { LoadAggregate } from '@potentiel-domain/core';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import {
  ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

export type AchèvementCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export type AchèvementQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAchèvementUseCases = ({ loadAggregate }: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(loadAggregate);

  registerTransmettreAttestationConformitéUseCase();
};

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
