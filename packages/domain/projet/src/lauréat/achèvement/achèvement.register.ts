import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import {
  type ConsulterAchèvementDependencies,
  registerConsulterAchèvementQuery,
} from './consulter/consulterAchèvement.query.js';
import { registerEnregistrerAttestationConformitéCommand } from './enregistrer/enregistrerAttestationConformité.command.js';
import { registerEnregistrerAttestationConformitéUseCase } from './enregistrer/enregistrerAttestationConformité.usecase.js';
import {
  type ListerProjetAvecAchevementATransmettreDependencies,
  registerListerProjetAvecAchevementATransmettreQuery,
} from './lister/listerProjetAvecAchevementATransmettre.query.js';
import { registerModifierAchèvementCommand } from './modifier/modifierAchèvement.command.js';
import { registerModifierAchèvementUseCase } from './modifier/modifierAchèvement.usecase.js';
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

  registerModifierAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerModifierAchèvementUseCase();

  registerTransmettreDateAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreDateAchèvementUseCase();

  registerEnregistrerAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerAttestationConformitéUseCase();

  registerModifierAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerModifierAttestationConformitéUseCase();
};

export type AchèvementQueryDependencies = ConsulterAchèvementDependencies &
  ListerProjetAvecAchevementATransmettreDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAchèvementQuery(dependencies);
  registerListerProjetAvecAchevementATransmettreQuery(dependencies);
};
