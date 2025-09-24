import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

import { TitrePageGarantiesFinancières } from '../../components/TitrePageGarantiesFinancières';
import { TypeGarantiesFinancièresSelectProps } from '../../TypeGarantiesFinancièresSelect';

import { SoumettreDépôtGarantiesFinancièresForm } from './SoumettreDépôtGarantiesFinancières.form';
import { soumettreDépôtGarantiesFinancièresAction } from './soumettreDépôtGarantiesFinancières.action';

export type SoumettreDépôtGarantiesFinancièresProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
};

export const SoumettreDépôtGarantiesFinancièresPage: FC<
  SoumettreDépôtGarantiesFinancièresProps
> = ({ identifiantProjet, typesGarantiesFinancières }) => (
  <ColumnPageTemplate
    banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}
    heading={<TitrePageGarantiesFinancières title="Soumettre des garanties financières" />}
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
