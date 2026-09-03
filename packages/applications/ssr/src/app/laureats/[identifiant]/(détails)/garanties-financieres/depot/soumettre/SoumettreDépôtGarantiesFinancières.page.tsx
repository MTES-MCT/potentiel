import type { FC } from 'react';

import { SectionPage } from '@/components/atoms/section/SectionPage';
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
  <SectionPage title="Soumettre des garanties financières">
    <SoumettreDépôtGarantiesFinancièresForm
      identifiantProjet={identifiantProjet}
      action={soumettreDépôtGarantiesFinancièresAction}
      submitLabel="Soumettre"
      typesGarantiesFinancières={typesGarantiesFinancières}
      alert={
        "Une fois les garanties financières déposées dans Potentiel, la DREAL concernée recevra une notification par mail l'invitant à vérifier leur conformité. Vous serez à votre tour notifié par mail à la validation des garanties financières."
      }
    />
  </SectionPage>
);
