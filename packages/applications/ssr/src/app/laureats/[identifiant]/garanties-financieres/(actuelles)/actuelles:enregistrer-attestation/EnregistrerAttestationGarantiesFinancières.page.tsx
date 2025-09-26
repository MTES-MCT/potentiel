import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';

import {
  EnregistrerAttestationGarantiesFinancièresForm,
  EnregistrerAttestationGarantiesFinancièresFormProps,
} from './EnregistrerAttestationGarantiesFinancières.form';

export type EnregistrerAttestationGarantiesFinancièresPageProps =
  EnregistrerAttestationGarantiesFinancièresFormProps;

export const EnregistrerAttestationGarantiesFinancièresPage: FC<
  EnregistrerAttestationGarantiesFinancièresPageProps
> = ({ identifiantProjet }) => {
  return (
    <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
      <TitrePageGarantiesFinancières title="Enregistrer l'attestation de constitution" />
      <EnregistrerAttestationGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    </PageTemplate>
  );
};
