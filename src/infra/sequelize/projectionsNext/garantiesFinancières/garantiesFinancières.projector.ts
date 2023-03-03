import { Projector } from '@infra/sequelize/helpers/Projection';
import { makeSequelizeProjector } from '../../helpers';
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
