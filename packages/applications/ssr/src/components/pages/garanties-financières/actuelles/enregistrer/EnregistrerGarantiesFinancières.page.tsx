import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import {
  GarantiesFinancièresForm,
  type GarantiesFinancièresFormProps,
} from '../../GarantiesFinancières.form';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresPageProps = Pick<
  GarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
>;

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <GarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitButtonLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </PageTemplate>
);
