import type { GetProjetAggregateRoot } from '../../..';
import {
  type ConsulterAttestationConformitéDependencies,
  registerConsulterAttestationConformitéQuery,
} from './consulter/consulterAttestationConformité.query';
import { registerModifierAttestationConformitéCommand } from './modifier/modifierAttestationConformité.command';
import { registerModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

export type AttestationConformitéCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAttestationConformitéUseCases = (
  dependencies: AttestationConformitéCommandDependencies,
) => {
  registerTransmettreAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreAttestationConformitéUseCase();

  registerModifierAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerModifierAttestationConformitéUseCase();
};

export type AttestationConformitéQueryDependencies = ConsulterAttestationConformitéDependencies;

export const registerAttestationConformitéQueries = (
  dependencies: AttestationConformitéQueryDependencies,
) => {
  registerConsulterAttestationConformitéQuery(dependencies);
};
