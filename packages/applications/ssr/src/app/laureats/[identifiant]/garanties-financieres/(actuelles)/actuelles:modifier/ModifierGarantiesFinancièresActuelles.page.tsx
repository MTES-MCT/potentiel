import { FC } from 'react';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';

import {
  ModifierGarantiesFinancièresActuellesForm,
  ModifierGarantiesFinancièresActuellesFormProps,
} from './ModifierGarantiesFinancièresActuelles.form';

export type ModifierGarantiesFinancièresActuellesPageProps =
  ModifierGarantiesFinancièresActuellesFormProps;

export const ModifierGarantiesFinancièresActuellesPage: FC<
  ModifierGarantiesFinancièresActuellesPageProps
> = ({ actuelles, typesGarantiesFinancières }) => (
  <>
    <TitrePageGarantiesFinancières title="Modifier les garanties financières actuelles" />
    <ModifierGarantiesFinancièresActuellesForm
      typesGarantiesFinancières={typesGarantiesFinancières}
      actuelles={actuelles}
    />
  </>
);
