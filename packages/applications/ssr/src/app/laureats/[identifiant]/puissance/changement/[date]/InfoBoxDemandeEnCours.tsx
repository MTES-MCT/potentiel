import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';

type Props = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  dateDemandeEnCours: string;
};

export const InfoBoxDemandeEnCours: FC<Props> = ({
  identifiantProjet,
  dateDemandeEnCours,
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
            dateDemandeEnCours,
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
