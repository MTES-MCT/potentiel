import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { PageTemplate } from '@/components/templates/Page.template';
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
  <PageTemplate>
    <div className="flex flex-col gap-4">
      <SoumettreDépôtGarantiesFinancièresForm
        identifiantProjet={identifiantProjet}
        action={soumettreDépôtGarantiesFinancièresAction}
        submitLabel="Soumettre"
        typesGarantiesFinancières={typesGarantiesFinancières}
        heading="Soumettre des garanties financières"
      />
      <Notice
        severity="info"
        title=""
        description={
          <span>
            Une fois les garanties financières déposées dans Potentiel, la DREAL concernée recevra
            une notification par mail l'invitant à vérifier leur conformité. Vous serez à votre tour
            notifié par mail à la validation des garanties financières.
          </span>
        }
      />
    </div>
  </PageTemplate>
);
