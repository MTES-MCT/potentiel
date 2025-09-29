import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';
import {
  SoumettreDépôtGarantiesFinancièresForm,
  type SoumettreDépôtGarantiesFinancièresFormProps,
} from '../depot:soumettre/SoumettreDépôtGarantiesFinancières.form';

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
    banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
    heading={
      <TitrePageGarantiesFinancières title="Modifier des garanties financières en attente de validation" />
    }
    leftColumn={{
      children: (
        <>
          <SoumettreDépôtGarantiesFinancièresForm
            identifiantProjet={identifiantProjet}
            action={modifierDépôtGarantiesFinancièresAction}
            submitButtonLabel="Modifier"
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
