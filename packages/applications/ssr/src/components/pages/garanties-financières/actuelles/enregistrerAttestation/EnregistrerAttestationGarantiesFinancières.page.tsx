import { FC } from 'react';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';

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
    <>
      <TitrePageGarantiesFinancières title="Enregistrer l'attestation de constitution" />
      <EnregistrerAttestationGarantiesFinancièresForm identifiantProjet={identifiantProjet} />
    </>
  );
};
