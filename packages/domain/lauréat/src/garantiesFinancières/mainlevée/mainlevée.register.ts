import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registeAccorderDemandeMainlevéeGarantiesFinancièresCommand } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.command';
import { registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import { registeRejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.command';
import { registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';

export const registerMainlevée = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières(loadAggregate);
  registeRejeterDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registeAccorderDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase();
  registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase();
  registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase();
};
