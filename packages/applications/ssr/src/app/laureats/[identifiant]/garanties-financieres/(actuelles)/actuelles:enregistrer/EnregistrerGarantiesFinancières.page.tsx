import { FC } from 'react';

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
  <>
    <TitrePageGarantiesFinancières title="Enregistrer des garanties financières" />

    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={enregistrerGarantiesFinancièresAction}
      submitLabel="Enregistrer"
      typesGarantiesFinancières={typesGarantiesFinancières}
    />
  </>
);
