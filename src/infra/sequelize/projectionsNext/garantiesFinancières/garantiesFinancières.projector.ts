import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { Projector } from '../projector';
import { GarantiesFinancières, garantiesFinancièresTableName } from './garantiesFinancières.model';

let garantiesFinancièresProjector: Projector | null;

export const getGarantiesFinancièresProjector = () => {
  if (!garantiesFinancièresProjector) {
    garantiesFinancièresProjector = makeSequelizeProjector(
      GarantiesFinancières,
      garantiesFinancièresTableName,
    );
  }

  return garantiesFinancièresProjector;
};
