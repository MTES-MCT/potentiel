import { FC } from 'react';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

import {
  ModifierGarantiesFinancièresActuellesForm,
  ModifierGarantiesFinancièresActuellesFormProps,
} from './ModifierGarantiesFinancièresActuelles.form';

export type ModifierGarantiesFinancièresActuellesPageProps =
  ModifierGarantiesFinancièresActuellesFormProps;

export const ModifierGarantiesFinancièresActuellesPage: FC<
  ModifierGarantiesFinancièresActuellesPageProps
> = (props) => {
  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={props.identifiantProjet} />}>
      <TitrePageGarantiesFinancières title="Modifier les garanties financières actuelles" />
      <ModifierGarantiesFinancièresActuellesForm {...props} />
    </PageTemplate>
  );
};
