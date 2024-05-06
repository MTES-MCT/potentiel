import { LoadAggregate } from '@potentiel-domain/core';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import {
  ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

export type AttestationConformitéCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export type AttestationConformitéQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAttestationConformitéUseCases = ({
  loadAggregate,
}: AttestationConformitéCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(loadAggregate);

  registerTransmettreAttestationConformitéUseCase();
};

export const registerAttestationConformitéQueries = (
  dependencies: AttestationConformitéQueryDependencies,
) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
