import { LoadAggregate } from '@potentiel-domain/core';

import { registeRejeterDemandeMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.command';
import { registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';

export const registerMainlevée = (loadAggregate: LoadAggregate) => {
  // commands
  registeRejeterDemandeMainlevéeGarantiesFinancièresCommand(loadAggregate);

  // usecases
  registerRejeterDemandeMainlevéeGarantiesFinancièresUseCase();
};
