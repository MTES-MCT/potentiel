import React, { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

export const TitrePageGarantiesFinancières: FC = ({}) => (
  <Heading1 className="flex items-center gap-3">
    <i className={fr.cx('ri-bank-line', 'fr-icon--lg')} aria-hidden />
    Garanties financières
  </Heading1>
);
