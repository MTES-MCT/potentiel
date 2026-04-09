import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  SoumettreDépôtGarantiesFinancièresForm,
  type SoumettreDépôtGarantiesFinancièresFormProps,
} from '../../depot/soumettre/SoumettreDépôtGarantiesFinancières.form';

import { enregistrerGarantiesFinancièresAction } from './enregistrerGarantiesFinancières.action';

export type EnregistrerGarantiesFinancièresPageProps = Pick<
  SoumettreDépôtGarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
>;

export const EnregistrerGarantiesFinancièresPage: FC<EnregistrerGarantiesFinancièresPageProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
  <>
    <Heading1>Enregistrer des garanties financières</Heading1>

    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </>
);
