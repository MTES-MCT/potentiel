import { GetProjetAggregateRoot } from '../../../index.js';

import {
  ConsulterDépôtGarantiesFinancièresDependencies,
  registerConsulterDépôtGarantiesFinancièresQuery,
} from './consulter/consulterDépôtGarantiesFinancières.query.js';
import { registerModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifier/modifierDépôtGarantiesFinancières.command.js';
import { registerModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase.js';
import { registerSoumettreDépôtGarantiesFinancièresCommand } from './soumettre/soumettreDépôtGarantiesFinancières.command.js';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase.js';
import { registerSupprimerDépôtGarantiesFinancièresCommand } from './supprimer/supprimerDépôtGarantiesFinancières.command.js';
import { registerSupprimerDépôtGarantiesFinancièresUseCase } from './supprimer/supprimerDépôtGarantiesFinancières.usecase.js';
import { registerValiderDépôtGarantiesFinancièresEnCoursCommand } from './valider/validerDépôtGarantiesFinancières.command.js';
import { registerValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase.js';
import {
  ListerDépôtsGarantiesFinancièresDependencies,
  registerListerDépôtsGarantiesFinancièresQuery,
} from './lister/listerDépôtGarantiesFinancières.query.js';

export type DépôtGarantiesFinancièresQueryDependencies =
  ConsulterDépôtGarantiesFinancièresDependencies & ListerDépôtsGarantiesFinancièresDependencies;

export type DépôtGarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDépôtGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: DépôtGarantiesFinancièresUseCasesDependencies) => {
  registerSoumettreDépôtGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerSoumettreDépôtGarantiesFinancièresUseCase();

  registerValiderDépôtGarantiesFinancièresEnCoursCommand(getProjetAggregateRoot);
  registerValiderDépôtGarantiesFinancièresEnCoursUseCase();

  registerModifierDépôtGarantiesFinancièresEnCoursCommand(getProjetAggregateRoot);
  registerModifierDépôtGarantiesFinancièresEnCoursUseCase();

  registerSupprimerDépôtGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerSupprimerDépôtGarantiesFinancièresUseCase();
};

export const registerDépôtGarantiesFinancièresQueries = (
  dependencies: DépôtGarantiesFinancièresQueryDependencies,
) => {
  registerConsulterDépôtGarantiesFinancièresQuery(dependencies);
  registerListerDépôtsGarantiesFinancièresQuery(dependencies);
};
