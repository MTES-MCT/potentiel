import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

type InfoBoxDemandeEnCoursProps = {
  identifiantProjet: string;
  dateDemandeEnCours: string;
};

export const InfoBoxDemandeEnCours: FC<InfoBoxDemandeEnCoursProps> = ({
  identifiantProjet,
  dateDemandeEnCours,
}) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Une demande de changement d'actionnaire est en cours,{' '}
        <Link
          href={Routes.Actionnaire.changement.détails(identifiantProjet, dateDemandeEnCours)}
          aria-label="voir le détail de la demande"
        >
          vous pouvez la retrouver ici
        </Link>
        .
      </div>
    }
  />
);
