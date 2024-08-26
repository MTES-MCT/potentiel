import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import {
  GarantiesFinancièresForm,
  type GarantiesFinancièresFormProps,
} from '../../GarantiesFinancières.form';

import { modifierDépôtEnCoursGarantiesFinancièresAction } from './modifierDépôtEnCoursGarantiesFinancières.action';

export type ModifierDépôtEnCoursGarantiesFinancièresPageProps = Pick<
  GarantiesFinancièresFormProps,
  'identifiantProjet' | 'typesGarantiesFinancières'
> & {
  dépôtEnCours: GarantiesFinancièresFormProps['defaultValues'];
  showWarning?: true;
};

export const ModifierDépôtEnCoursGarantiesFinancièresPage: FC<
  ModifierDépôtEnCoursGarantiesFinancièresPageProps
> = ({ identifiantProjet, typesGarantiesFinancières, dépôtEnCours, showWarning }) => (
  <ColumnPageTemplate
    banner={<ProjetBanner identifiantProjet={identifiantProjet} />}
    heading={
      <TitrePageGarantiesFinancières title="Modifier des garanties financières en attente de validation" />
    }
    leftColumn={{
      children: (
        <>
          <GarantiesFinancièresForm
            identifiantProjet={identifiantProjet}
            action={modifierDépôtEnCoursGarantiesFinancièresAction}
            submitButtonLabel="Modifier"
            typesGarantiesFinancières={typesGarantiesFinancières}
            defaultValues={dépôtEnCours}
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
