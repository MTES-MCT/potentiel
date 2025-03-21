import { FC } from 'react';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

import {
  ModifierGarantiesFinancièresActuellesForm,
  ModifierGarantiesFinancièresActuellesFormProps,
} from './ModifierGarantiesFinancièresActuelles.form';

export type ModifierGarantiesFinancièresActuellesPageProps =
  ModifierGarantiesFinancièresActuellesFormProps;

export const ModifierGarantiesFinancièresActuellesPage: FC<
  ModifierGarantiesFinancièresActuellesPageProps
> = (props) => (
  <>
    <TitrePageGarantiesFinancières title="Modifier les garanties financières actuelles" />
    <ModifierGarantiesFinancièresActuellesForm
      identifiantProjet={props.identifiantProjet}
      typesGarantiesFinancières={props.typesGarantiesFinancières}
      actuelles={props.actuelles}
    />
  </>
);
