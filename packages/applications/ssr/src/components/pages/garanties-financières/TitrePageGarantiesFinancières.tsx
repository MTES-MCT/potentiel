import React, { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

export const TitrePageGarantiesFinancières: FC = () => (
  <Heading1>
    <i className={`${fr.cx('ri-bank-line', 'fr-icon--lg')} mr-1`} aria-hidden />
    Garanties Financières
  </Heading1>
);
