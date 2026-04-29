import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';

import {
  ConsulterPowerPurchaseAgreementDependencies,
  registerConsulterPowerPurchaseAgreementQuery,
} from './consulter/consulterPowerPurchaseAgreement.query.js';
import {
  ListerHistoriquePowerPurchaseAgreementProjetDependencies,
  registerListerHistoriquePowerPurchaseAgreementProjetQuery,
} from './listerHistorique/listerHistoriquePowerPurchaseAgreementProjet.query.js';
import { registerSignalerPowerPurchaseAgreementCommand } from './signaler/signalerPowerPurchaseAgreement.command.js';
import { registerSignalerPowerPurchaseAgreementUseCase } from './signaler/signalerPowerPurchaseAgreement.usecase.js';

export type PowerPurchaseAgreementQueryDependencies = ConsulterPowerPurchaseAgreementDependencies &
  ListerHistoriquePowerPurchaseAgreementProjetDependencies;

export type PowerPurchaseAgreementCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerPowerPurchaseAgreementUseCases = (
  dependencies: PowerPurchaseAgreementCommandDependencies,
) => {
  registerSignalerPowerPurchaseAgreementCommand(dependencies.getProjetAggregateRoot);
  registerSignalerPowerPurchaseAgreementUseCase();
};

export const registerPowerPurchaseAgreementQueries = (
  dependencies: PowerPurchaseAgreementQueryDependencies,
) => {
  registerConsulterPowerPurchaseAgreementQuery(dependencies);
  registerListerHistoriquePowerPurchaseAgreementProjetQuery(dependencies);
};
