import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registeAccorderDemandeMainlevéeGarantiesFinancièresCommand } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.command';
import { registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import { registeRejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.command';
import { registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';

export const registerMainlevée = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerAnnulerMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières(loadAggregate);
  registeRejeterDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registeAccorderDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase();
  registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase();
  registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase();
};
