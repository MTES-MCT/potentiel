import { FC } from 'react';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';

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
      <TitrePageGarantiesFinancières title="Enregistrer l'attestation des garanties financières" />
      <EnregistrerAttestationGarantiesFinancièresForm
        identifiantProjet={identifiantProjet}
        garantiesFinancièresActuelles={garantiesFinancièresActuelles}
      />
    </>
  );
};
