import { Heading1 } from '@/components/atoms/headings';

import { AnnulerSignalementPowerPurchaseAgreementForm } from './AnnulerSignalementPowerPurchaseAgreement.form';
import {
  DétailsPowerPurchaseAgreement,
  DétailsPowerPurchaseAgreementProps,
} from './DétailsPowerPurchaseAgreement';

export type AnnulerSignalementPowerPurchaseAgreementPageProps = DétailsPowerPurchaseAgreementProps;

export const AnnulerSignalementPowerPurchaseAgreementPage: React.FC<
  AnnulerSignalementPowerPurchaseAgreementPageProps
> = ({ PPA }) => {
  return (
    <>
      <Heading1>Annuler le signalement du contrat de vente de gré à gré (PPA)</Heading1>
      <DétailsPowerPurchaseAgreement PPA={PPA} />
      <AnnulerSignalementPowerPurchaseAgreementForm identifiantProjet={PPA.identifiantProjet} />
    </>
  );
};
