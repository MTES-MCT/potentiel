import React, { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

type TitrePageGarantiesFinancièresProps = {
  title: string;
};

export const TitrePageGarantiesFinancières: FC<TitrePageGarantiesFinancièresProps> = ({
  title,
}) => (
  <Heading1>
    <i className={`${fr.cx('ri-bank-line', 'fr-icon--lg')} mr-1`} aria-hidden />
    {title}
  </Heading1>
);
