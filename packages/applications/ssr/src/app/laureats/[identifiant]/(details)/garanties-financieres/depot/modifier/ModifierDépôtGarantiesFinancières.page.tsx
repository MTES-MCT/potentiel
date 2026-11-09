import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
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
  <PageTemplate>
    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={modifierDépôtGarantiesFinancièresAction}
      submitLabel="Modifier"
      typesGarantiesFinancières={typesGarantiesFinancières}
      dépôt={dépôt}
      heading="Modifier des garanties financières en attente de validation"
      alert={
        showWarning &&
        "Vous pouvez modifier ce dépôt de garanties financières jusqu'à sa validation par la DREAL."
      }
    />
  </PageTemplate>
);
