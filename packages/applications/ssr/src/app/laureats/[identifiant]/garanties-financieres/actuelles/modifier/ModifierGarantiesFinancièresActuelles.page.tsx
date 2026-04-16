import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

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
    <Heading1>Modifier les garanties financières actuelles</Heading1>
    <ModifierGarantiesFinancièresActuellesForm
      typesGarantiesFinancières={typesGarantiesFinancières}
      actuelles={actuelles}
    />
  </>
);
