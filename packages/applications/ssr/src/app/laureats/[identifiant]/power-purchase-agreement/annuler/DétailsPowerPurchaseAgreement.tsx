import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { Heading2 } from '@/components/atoms/headings';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { PPABadge } from '@/components/molecules/projet/lauréat/PPABadge';
import { DisplayAuteur } from '@/components/atoms/demande/DisplayAuteur';

export type DétailsPowerPurchaseAgreementProps = {
  PPA: PlainType<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementReadModel>;
};

export const DétailsPowerPurchaseAgreement: FC<DétailsPowerPurchaseAgreementProps> = ({ PPA }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row gap-4">
          <div className="flex-shrink-0">
            <Heading2>Détails du signalement PPA</Heading2>
          </div>
          <div className="flex-shrink-0">
            <PPABadge />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-2 italic">
          Signalé le{' '}
          <FormattedDate className="font-medium" date={DateTime.bind(PPA.signaléLe).formatter()} />
          <DisplayAuteur email={Email.bind(PPA.signaléPar)} />
        </div>
      </div>
    </div>
  );
};
