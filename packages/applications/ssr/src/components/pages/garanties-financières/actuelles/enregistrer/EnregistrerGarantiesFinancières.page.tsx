import { FC } from 'react';

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
  <>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <GarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitButtonLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </>
);
