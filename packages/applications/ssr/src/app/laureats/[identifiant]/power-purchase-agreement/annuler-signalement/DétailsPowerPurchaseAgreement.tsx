import { FC } from 'react';

import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export type DétailsPowerPurchaseAgreementProps = {
  powerPurchaseAgreement: PlainType<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementReadModel>;
};

export const DétailsPowerPurchaseAgreement: FC<DétailsPowerPurchaseAgreementProps> = ({
  powerPurchaseAgreement,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mb-2 italic">
          Signalé <span className="font-semibold">PPA</span> le{' '}
          <FormattedDate
            className="font-medium"
            date={DateTime.bind(powerPurchaseAgreement.signaléLe).formatter()}
          />
          <DisplayAuteur email={Email.bind(powerPurchaseAgreement.signaléPar)} />
        </div>
      </div>
    </div>
  );
};
