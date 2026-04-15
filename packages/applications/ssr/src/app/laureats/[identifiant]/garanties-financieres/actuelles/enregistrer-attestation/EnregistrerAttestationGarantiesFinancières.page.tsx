import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerAttestationGarantiesFinancièresForm,
  EnregistrerAttestationGarantiesFinancièresFormProps,
} from './EnregistrerAttestationGarantiesFinancières.form';

export type EnregistrerAttestationGarantiesFinancièresPageProps =
  EnregistrerAttestationGarantiesFinancièresFormProps;

export const EnregistrerAttestationGarantiesFinancièresPage: FC<
  EnregistrerAttestationGarantiesFinancièresPageProps
> = ({ identifiantProjet, garantiesFinancièresActuelles }) => {
  return (
    <>
      <Heading1>Enregistrer l'attestation des garanties financières</Heading1>
      <EnregistrerAttestationGarantiesFinancièresForm
        identifiantProjet={identifiantProjet}
        garantiesFinancièresActuelles={garantiesFinancièresActuelles}
      />
    </>
  );
};
