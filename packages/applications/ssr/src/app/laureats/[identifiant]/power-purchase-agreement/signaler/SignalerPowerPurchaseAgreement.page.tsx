import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  SignalerPowerPurchaseAgreementForm,
  SignalerPowerPurchaseAgreementFormProps,
} from './SignalerPowerPurchaseAgreement.form';

export type SignalerPowerPurchaseAgreementPageProps = SignalerPowerPurchaseAgreementFormProps;

export const SignalerPowerPurchaseAgreementPage: React.FC<
  SignalerPowerPurchaseAgreementPageProps
> = ({ identifiantProjet }) => {
  return (
    <ColumnPageTemplate
      heading={<Heading1>Signaler un contrat de gré à gré (PPA)</Heading1>}
      leftColumn={{
        children: <SignalerPowerPurchaseAgreementForm identifiantProjet={identifiantProjet} />,
      }}
      rightColumn={{ children: <></> }}
    />
  );
};
