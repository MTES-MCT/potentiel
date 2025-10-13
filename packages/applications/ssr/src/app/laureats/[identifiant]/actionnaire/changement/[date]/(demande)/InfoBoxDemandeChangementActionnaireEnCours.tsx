import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';

type Props = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  demandeEnCoursDate: string;
};

export const InfoBoxDemandeChangementActionnaireEnCours: FC<Props> = ({
  identifiantProjet,
  demandeEnCoursDate,
}: Props) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Une demande de changement d'actionnaire est en cours,{' '}
        <Link
          href={Routes.Actionnaire.changement.détails(
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
