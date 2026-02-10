import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';

import {
  ConsulterAchèvementDependencies,
  registerConsulterAchèvementQuery,
} from './consulter/consulterAchèvement.query.js';
import {
  ListerProjetAvecAchevementATransmettreDependencies,
  registerListerProjetAvecAchevementATransmettreQuery,
} from './lister/listerProjetAvecAchevementATransmettre.query.js';
import { registerModifierAttestationConformitéCommand } from './modifier/modifierAttestationConformité.command.js';
import { registerModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase.js';
import { registerTransmettreAttestationConformitéCommand } from './transmettre/transmettreAttestationConformité.command.js';
import { registerTransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase.js';
import { registerTransmettreDateAchèvementCommand } from './transmettre/transmettreDateAchèvement.command.js';
import { registerTransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase.js';

export type AchèvementCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAchèvementUseCases = (dependencies: AchèvementCommandDependencies) => {
  registerTransmettreAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreAttestationConformitéUseCase();

  registerModifierAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerModifierAttestationConformitéUseCase();

  registerTransmettreDateAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreDateAchèvementUseCase();
};

export type AchèvementQueryDependencies = ConsulterAchèvementDependencies &
  ListerProjetAvecAchevementATransmettreDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAchèvementQuery(dependencies);
  registerListerProjetAvecAchevementATransmettreQuery(dependencies);
};
