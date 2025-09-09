import { GetProjetAggregateRoot } from '../../..';

import {
  ConsulterDépôtGarantiesFinancièresDependencies,
  registerConsulterDépôtGarantiesFinancièresQuery,
} from './consulter/consulterDépôtGarantiesFinancières.query';
import { registerModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifier/modifierDépôtGarantiesFinancières.command';
import { registerModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase';
import { registerSoumettreDépôtGarantiesFinancièresCommand } from './soumettre/soumettreDépôtGarantiesFinancières.command';
import { registerSoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';
import { registerSupprimerDépôtGarantiesFinancièresCommand } from './supprimer/supprimerDépôtGarantiesFinancières.command';
import { registerSupprimerDépôtGarantiesFinancièresUseCase } from './supprimer/supprimerDépôtGarantiesFinancières.usecase';
import { registerValiderDépôtGarantiesFinancièresEnCoursCommand } from './valider/validerDépôtGarantiesFinancières.command';
import { registerValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase';
import {
  ListerDépôtsGarantiesFinancièresDependencies,
  registerListerDépôtsGarantiesFinancièresQuery,
} from './lister/listerDépôtGarantiesFinancières.query';

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
