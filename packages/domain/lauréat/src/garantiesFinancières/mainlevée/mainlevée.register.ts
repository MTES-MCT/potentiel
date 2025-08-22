import type { LoadAggregate } from '@potentiel-domain/core';
import type { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import { registeAccorderDemandeMainlevéeGarantiesFinancièresCommand } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.command';
import { registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderDemandeMainlevéeGarantiesFinancières.usecase';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.usecase';
import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './demander/demanderMainlevéeGarantiesFinancières.command';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionDemandeMainlevéeGarantiesFinancières.usecase';
import { registeRejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.command';
import { registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';

export const registerMainlevée = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  // commands
  registerDemanderMainlevéeGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);
  registerAnnulerMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancières(loadAggregate);
  registeRejeterDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);
  registeAccorderDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate, getProjetAggregateRoot);

  // usecases
  registerDemanderMainlevéeGarantiesFinancièresUseCase();
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
  registerDémarrerInstructionDemandeMainlevéeGarantiesFinancièresUseCase();
  registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase();
  registerAccorderDemandeMainlevéeGarantiesFinancièresUseCase();
};
