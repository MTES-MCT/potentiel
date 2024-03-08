import React, { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

type TitrePageGarantiesFinancièresProps = {
  title?: string;
};

export const TitrePageGarantiesFinancières: FC<TitrePageGarantiesFinancièresProps> = ({
  title = 'Garanties financières',
}) => (
  <Heading1 className="flex items-center gap-3">
    <i className={fr.cx('ri-bank-line', 'fr-icon--lg')} aria-hidden />
    {title}
  </Heading1>
);
