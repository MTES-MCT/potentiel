'use client';

import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetBanner, ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';
import { FormulaireGarantiesFinancières } from '../../FormulaireGarantiesFinancières';

import { soumettreGarantiesFinancièresAction } from './soumettreGarantiesFinancières.action';

export type SoumettreGarantiesFinancièresProps = {
  projet: ProjetBannerProps;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const SoumettreGarantiesFinancièresPage: FC<SoumettreGarantiesFinancièresProps> = ({
  projet,
  typesGarantiesFinancières,
}) => (
  <ColumnPageTemplate
    banner={<ProjetBanner {...projet} />}
    heading={<TitrePageGarantiesFinancières title="Soumettre des garanties financières" />}
    leftColumn={{
      children: (
        <FormulaireGarantiesFinancières
          identifiantProjet={projet.identifiantProjet}
          action={soumettreGarantiesFinancièresAction}
          submitButtonLabel="Soumettre"
          typesGarantiesFinancières={typesGarantiesFinancières}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Alert
          severity="info"
          small
          description={
            <p className="py-4">
              Une fois les garanties financières déposées dans Potentiel, la DREAL concernée recevra
              une notification par mail l'invitant à vérifier leur conformité. Vous serez à votre
              tour notifié par mail à la validation des garanties financières.
            </p>
          }
        />
      ),
    }}
  />
);
