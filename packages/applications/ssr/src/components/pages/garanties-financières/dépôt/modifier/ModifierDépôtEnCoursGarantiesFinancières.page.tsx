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

import { ValiderDépôtEnCoursGarantiesFinancières } from './valider/validerDépôtEnCoursGarantiesFinancières';
import { RejeterDépôtEnCoursGarantiesFinancières } from './rejeter/RejeterDépôtEnCoursGarantiesFinancières';
import { SupprimerDépôtEnCoursGarantiesFinancières } from './supprimer/SupprimerDépôtEnCoursGarantiesFinancières';
import { modifierDépôtEnCoursGarantiesFinancièresAction } from './modifierDépôtEnCoursGarantiesFinancières.action';

type AvailableActions = Array<'valider' | 'rejeter' | 'supprimer'>;

export type ModifierDépôtEnCoursGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: FormulaireGarantiesFinancièresProps['typesGarantiesFinancières'];
  dépôtEnCours: DépôtGarantiesFinancières;
  showWarning?: true;
  actions: AvailableActions;
};

export const ModifierDépôtEnCoursGarantiesFinancièresPage: FC<
  ModifierDépôtEnCoursGarantiesFinancièresProps
> = ({ projet, typesGarantiesFinancières, dépôtEnCours, showWarning, actions }) => (
  <ColumnPageTemplate
    banner={<ProjetBanner {...projet} />}
    heading={
      <TitrePageGarantiesFinancières title="Modifier des garanties financières en attente de validation" />
    }
    leftColumn={{
      children: (
        <>
          {showWarning && (
            <Alert
              severity="warning"
              className="mb-3"
              title=""
              description={
                <>
                  Vous pouvez modifier ou supprimer cette soumission de garanties financières
                  jusqu'à la validation par la DREAL concernée.
                </>
              }
            />
          )}
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
      children: mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
      }),
    }}
  />
);

type MapToActionsComponentsProps = {
  actions: AvailableActions;
  identifiantProjet: string;
};
const mapToActionComponents = ({ actions, identifiantProjet }: MapToActionsComponentsProps) => {
  return actions.length ? (
    <>
      {actions.includes('valider') && (
        <ValiderDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('rejeter') && (
        <RejeterDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
      {actions.includes('supprimer') && (
        <SupprimerDépôtEnCoursGarantiesFinancières identifiantProjet={identifiantProjet} />
      )}
    </>
  ) : null;
};
