import Notice from '@codegouvfr/react-dsfr/Notice';

import { Heading1 } from '@/components/atoms/headings';

import {
  SignalerPowerPurchaseAgreementForm,
  SignalerPowerPurchaseAgreementFormProps,
} from './SignalerPowerPurchaseAgreement.form';

export type SignalerPowerPurchaseAgreementPageProps = SignalerPowerPurchaseAgreementFormProps;

export const SignalerPowerPurchaseAgreementPage: React.FC<
  SignalerPowerPurchaseAgreementPageProps
> = ({ identifiantProjet }) => {
  return (
    <>
      <Heading1>Signaler un contrat de vente de gré à gré (PPA)</Heading1>
      <Notice
        description="Vous pouvez signaler le projet comme étant signataire d'un contrat de vente de gré à gré (PPA). Cela signifie que le projet est sorti du dispositif de l'appel d'offres."
        title=""
        severity="info"
        className="print:hidden"
      />
      <SignalerPowerPurchaseAgreementForm identifiantProjet={identifiantProjet} />
    </>
  );
};
