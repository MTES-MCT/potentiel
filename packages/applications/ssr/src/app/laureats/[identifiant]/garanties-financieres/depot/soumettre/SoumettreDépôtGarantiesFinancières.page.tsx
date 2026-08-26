import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import type { GarantiesFinancièresFormInputsProps } from '../../components/GarantiesFinancièresFormInputs';
import { SoumettreDépôtGarantiesFinancièresForm } from './SoumettreDépôtGarantiesFinancières.form';
import { soumettreDépôtGarantiesFinancièresAction } from './soumettreDépôtGarantiesFinancières.action';

export type SoumettreDépôtGarantiesFinancièresProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: GarantiesFinancièresFormInputsProps['typesGarantiesFinancières'];
};

export const SoumettreDépôtGarantiesFinancièresPage: FC<
  SoumettreDépôtGarantiesFinancièresProps
> = ({ identifiantProjet, typesGarantiesFinancières }) => (
  <ColumnPageTemplate
    heading={<Heading1>Soumettre des garanties financières</Heading1>}
    leftColumn={{
      children: (
        <SoumettreDépôtGarantiesFinancièresForm
          identifiantProjet={identifiantProjet}
          action={soumettreDépôtGarantiesFinancièresAction}
          submitLabel="Soumettre"
          typesGarantiesFinancières={typesGarantiesFinancières}
        />
      ),
    }}
    rightColumn={{
      children: (
        <Notice
          severity="info"
          title=""
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
