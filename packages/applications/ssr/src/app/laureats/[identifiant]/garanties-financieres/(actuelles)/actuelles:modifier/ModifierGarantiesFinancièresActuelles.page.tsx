import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';

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
  <PageTemplate
    banner={
      <ProjetBanner
        identifiantProjet={IdentifiantProjet.bind(actuelles.identifiantProjet).formatter()}
      />
    }
  >
    <TitrePageGarantiesFinancières title="Modifier les garanties financières actuelles" />
    <ModifierGarantiesFinancièresActuellesForm
      typesGarantiesFinancières={typesGarantiesFinancières}
      actuelles={actuelles}
    />
  </PageTemplate>
);
