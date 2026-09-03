import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
import {
  SoumettreDépôtGarantiesFinancièresForm,
  type SoumettreDépôtGarantiesFinancièresFormProps,
} from '../soumettre/SoumettreDépôtGarantiesFinancières.form';
import { modifierDépôtGarantiesFinancièresAction } from './modifierDépôtGarantiesFinancières.action';

export type ModifierDépôtGarantiesFinancièresPageProps = Pick<
  SoumettreDépôtGarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
> & {
  dépôt: SoumettreDépôtGarantiesFinancièresFormProps['dépôt'];
  showWarning?: true;
};

export const ModifierDépôtGarantiesFinancièresPage: FC<
  ModifierDépôtGarantiesFinancièresPageProps
> = ({ identifiantProjet, typesGarantiesFinancières, dépôt, showWarning }) => (
  <SectionPage title="Modifier des garanties financières en attente de validation">
    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={modifierDépôtGarantiesFinancièresAction}
      submitLabel="Modifier"
      typesGarantiesFinancières={typesGarantiesFinancières}
      dépôt={dépôt}
      alert={
        showWarning &&
        "Vous pouvez modifier ce dépôt de garanties financières jusqu'à sa validation par la DREAL."
      }
    />
  </SectionPage>
);
