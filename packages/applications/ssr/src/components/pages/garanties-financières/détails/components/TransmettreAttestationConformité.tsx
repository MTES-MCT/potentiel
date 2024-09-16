import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

export type TransmettreAttestationConformitéProps = {
  identifiantProjet: string;
};

export const TransmettreAttestationConformité: FC<TransmettreAttestationConformitéProps> = ({
  identifiantProjet,
}) => (
  <Link href={Routes.Achèvement.transmettreAttestationConformité(identifiantProjet)}>
    Transmettre l'attestation de conformité
  </Link>
);
