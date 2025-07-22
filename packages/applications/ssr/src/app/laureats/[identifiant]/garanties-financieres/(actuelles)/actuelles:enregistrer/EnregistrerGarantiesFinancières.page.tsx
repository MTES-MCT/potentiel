import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';
import {
  SoumettreDépôtGarantiesFinancièresForm,
  type SoumettreDépôtGarantiesFinancièresFormProps,
} from '../../(dépôt)/depot:soumettre/SoumettreDépôtGarantiesFinancières.form';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresPageProps = Pick<
  SoumettreDépôtGarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
>;

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
  <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitButtonLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </PageTemplate>
);
