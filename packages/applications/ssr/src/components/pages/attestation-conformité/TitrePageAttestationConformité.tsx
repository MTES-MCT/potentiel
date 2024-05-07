import React, { FC } from 'react';
import { fr } from '@codegouvfr/react-dsfr';

import { Heading1 } from '@/components/atoms/headings';

type TitrePageAttestationConformitéProps = {
  title?: string;
};

export const TitrePageAttestationConformité: FC<TitrePageAttestationConformitéProps> = ({
  title = 'Attestation de conformité',
}) => (
  <Heading1 className="flex items-center gap-3">
    <i className={fr.cx('ri-verified-badge-line', 'fr-icon--lg')} aria-hidden />
    {title}
  </Heading1>
);
