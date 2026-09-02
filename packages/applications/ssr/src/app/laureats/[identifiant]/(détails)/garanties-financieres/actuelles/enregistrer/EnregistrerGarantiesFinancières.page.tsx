import type { FC } from 'react';

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
  <SoumettreDépôtGarantiesFinancièresForm
    identifiantProjet={identifiantProjet}
    action={enregistrerGarantiesFinancièresAction}
    submitLabel="Enregistrer"
    typesGarantiesFinancières={typesGarantiesFinancières}
    heading="Enregistrer des garanties financières"
  />
);
