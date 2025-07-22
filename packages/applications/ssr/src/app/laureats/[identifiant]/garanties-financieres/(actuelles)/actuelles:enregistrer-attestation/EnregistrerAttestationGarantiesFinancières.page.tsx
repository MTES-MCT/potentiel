import { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

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
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      <TitrePageGarantiesFinancières title="Enregistrer l'attestation de constitution" />
      <EnregistrerAttestationGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    </PageTemplate>
  );
};
