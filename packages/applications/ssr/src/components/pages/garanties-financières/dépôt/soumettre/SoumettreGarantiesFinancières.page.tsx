import React, { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnTemplate } from '@/components/templates/Column.template';

import { TitrePageGarantiesFinancières } from '../../TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';
import { GarantiesFinancièresForm } from '../../GarantiesFinancières.form';

import { soumettreGarantiesFinancièresAction } from './soumettreGarantiesFinancières.action';

export type SoumettreGarantiesFinancièresProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const SoumettreGarantiesFinancièresPage: FC<SoumettreGarantiesFinancièresProps> = ({
  identifiantProjet,
  typesGarantiesFinancières,
}) => (
  <ColumnTemplate
    heading={<TitrePageGarantiesFinancières title="Soumettre des garanties financières" />}
    leftColumn={{
      children: (
        <GarantiesFinancièresForm
          identifiantProjet={identifiantProjet}
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
