import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

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
  <ColumnPageTemplate
    heading={<Heading1>Modifier des garanties financières en attente de validation</Heading1>}
    leftColumn={{
      children: (
        <>
          <SoumettreDépôtGarantiesFinancièresForm
            identifiantProjet={identifiantProjet}
            action={modifierDépôtGarantiesFinancièresAction}
            submitLabel="Modifier"
            typesGarantiesFinancières={typesGarantiesFinancières}
            dépôt={dépôt}
          />
        </>
      ),
    }}
    rightColumn={{
      className: 'flex flex-col w-full md:w-1/4 gap-4',
      children: (
        <>
          {showWarning ? (
            <Alert
              severity="warning"
              className="mb-3"
              title=""
              description={
                <>
                  Vous pouvez modifier ce dépôt de garanties financières jusqu'à sa validation par
                  la DREAL.
                </>
              }
            />
          ) : null}
        </>
      ),
    }}
  />
);
