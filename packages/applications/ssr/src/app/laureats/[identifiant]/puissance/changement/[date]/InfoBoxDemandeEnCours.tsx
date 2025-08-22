import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

type Props = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demandeEnCoursDate: string;
};

export const InfoBoxDemandeEnCours: FC<Props> = ({
  identifiantProjet,
  demandeEnCoursDate,
}: Props) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Une demande de changement de puissance est en cours,{' '}
        <Link
          href={Routes.Puissance.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandeEnCoursDate,
          )}
          aria-label="voir le détail de la demande"
        >
          vous pouvez la retrouver ici
        </Link>
        .
      </div>
    }
  />
);
