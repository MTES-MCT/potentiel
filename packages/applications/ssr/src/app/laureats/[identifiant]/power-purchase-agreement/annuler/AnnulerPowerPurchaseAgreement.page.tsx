import { Heading1 } from '@/components/atoms/headings';

import { AnnulerPowerPurchaseAgreementForm } from './AnnulerPowerPurchaseAgreement.form';
import {
  DétailsPowerPurchaseAgreement,
  DétailsPowerPurchaseAgreementProps,
} from './DétailsPowerPurchaseAgreement';

export type AnnulerPowerPurchaseAgreementPageProps = DétailsPowerPurchaseAgreementProps;

export const AnnulerPowerPurchaseAgreementPage: React.FC<
  AnnulerPowerPurchaseAgreementPageProps
> = ({ PPA }) => {
  return (
    <>
      <Heading1>Annuler le signalement du contrat de vente de gré à gré (PPA)</Heading1>
      <DétailsPowerPurchaseAgreement PPA={PPA} />
      <AnnulerPowerPurchaseAgreementForm identifiantProjet={PPA.identifiantProjet} />
    </>
  );
};
