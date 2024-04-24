'use client';

import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';
import { DépôtGarantiesFinancières } from '../../détails/components/GarantiesFinancièresHistoriqueDépôts';
import {
  FormulaireGarantiesFinancières,
  FormulaireGarantiesFinancièresProps,
} from '../../FormulaireGarantiesFinancières';

import { modifierDépôtEnCoursGarantiesFinancièresAction } from './modifierDépôtEnCoursGarantiesFinancières.action';

export type ModifierDépôtEnCoursGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: FormulaireGarantiesFinancièresProps['typesGarantiesFinancières'];
  dépôtEnCours: DépôtGarantiesFinancières;
  showWarning?: true;
};

export const ModifierDépôtEnCoursGarantiesFinancièresPage: FC<
  ModifierDépôtEnCoursGarantiesFinancièresProps
> = ({ projet, typesGarantiesFinancières, dépôtEnCours, showWarning }) => (
  <ColumnPageTemplate
    banner={<ProjetBanner {...projet} />}
    heading={
      <TitrePageGarantiesFinancières title="Modifier des garanties financières en attente de validation" />
    }
    leftColumn={{
      children: (
        <>
          <FormulaireGarantiesFinancières
            identifiantProjet={projet.identifiantProjet}
            action={modifierDépôtEnCoursGarantiesFinancièresAction}
            submitButtonLabel="Modifier"
            typesGarantiesFinancières={typesGarantiesFinancières}
            defaultValues={{
              typeGarantiesFinancières:
                dépôtEnCours.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'],
              dateÉchéance:
                dépôtEnCours.type === 'avec-date-échéance' ? dépôtEnCours.dateÉchéance : undefined,
              dateConstitution: dépôtEnCours.dateConstitution,
              attestation: dépôtEnCours.attestation,
            }}
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
