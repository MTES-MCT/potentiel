import React, { FC, ReactNode } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

type TitrePageGarantiesFinancièresProps = {
  title: ReactNode;
};

export const TitrePageGarantiesFinancières: FC<TitrePageGarantiesFinancièresProps> = ({
  title,
}) => (
  <Heading1 className="flex items-center gap-1">
    <i className={fr.cx('ri-bank-line', 'fr-icon--lg')} aria-hidden />
    {title}
  </Heading1>
);
