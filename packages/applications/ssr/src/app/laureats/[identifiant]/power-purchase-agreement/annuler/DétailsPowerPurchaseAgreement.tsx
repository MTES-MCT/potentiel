import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';

export type DétailsPowerPurchaseAgreementProps = {
  PPA: PlainType<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementReadModel>;
};

export const DétailsPowerPurchaseAgreement: FC<DétailsPowerPurchaseAgreementProps> = ({ PPA }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mb-2 italic">
          Signalé <span className="font-semibold">PPA</span> le{' '}
          <FormattedDate className="font-medium" date={DateTime.bind(PPA.signaléLe).formatter()} />
          <DisplayAuteur email={Email.bind(PPA.signaléPar)} />
        </div>
      </div>
    </div>
  );
};
