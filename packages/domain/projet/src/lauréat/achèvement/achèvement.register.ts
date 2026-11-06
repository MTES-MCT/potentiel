import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';
import {
  type ConsulterAchèvementDependencies,
  registerConsulterAchèvementQuery,
} from './consulter/consulterAchèvement.query.js';
import {
  type ConsulterDonnéesProjetPourAchèvementDependencies,
  registerConsulterDonnéesProjetPourAchèvementQuery,
} from './consulter/consulterDonnéesProjetPourAchèvement.query.js';
import { registerCorrigerDateAchèvementCommand } from './corriger/corrigerDateAchèvement.command.js';
import { registerCorrigerDateAchèvementUseCase } from './corriger/corrigerDateAchèvement.usecase.js';
import { registerEnregistrerAttestationConformitéCommand } from './enregistrer/enregistrerAttestationConformité.command.js';
import { registerEnregistrerAttestationConformitéUseCase } from './enregistrer/enregistrerAttestationConformité.usecase.js';
import { registerInitierAchèvementCommand } from './initier/initierAchèvement.command.js';
import { registerInitierAchèvementUseCase } from './initier/initierAchèvement.usecase.js';
import {
  type ListerProjetAvecAchèvementÀTransmettreDependencies,
  registerListerProjetAvecAchèvementÀTransmettreQuery,
} from './lister/listerProjetAvecAchèvementÀTransmettre.query.js';
import {
  type ListerProjetsEnAttenteDAchèvementDependencies,
  registerListerProjetsEnAttenteDAchèvementQuery,
} from './lister/listerProjetsEnAttenteDAchèvement.query.js';
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
  registerInitierAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerInitierAchèvementUseCase();

  registerTransmettreAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreAttestationConformitéUseCase();

  registerModifierAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerModifierAchèvementUseCase();

  registerTransmettreDateAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerTransmettreDateAchèvementUseCase();

  registerCorrigerDateAchèvementCommand(dependencies.getProjetAggregateRoot);
  registerCorrigerDateAchèvementUseCase();

  registerEnregistrerAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerEnregistrerAttestationConformitéUseCase();

  registerModifierAttestationConformitéCommand(dependencies.getProjetAggregateRoot);
  registerModifierAttestationConformitéUseCase();
};

export type AchèvementQueryDependencies = ConsulterAchèvementDependencies &
  ConsulterDonnéesProjetPourAchèvementDependencies &
  ListerProjetAvecAchèvementÀTransmettreDependencies &
  ListerProjetsEnAttenteDAchèvementDependencies;

export const registerAchèvementQueries = (dependencies: AchèvementQueryDependencies) => {
  registerConsulterAchèvementQuery(dependencies);
  registerConsulterDonnéesProjetPourAchèvementQuery(dependencies);
  registerListerProjetAvecAchèvementÀTransmettreQuery(dependencies);
  registerListerProjetsEnAttenteDAchèvementQuery(dependencies);
};
