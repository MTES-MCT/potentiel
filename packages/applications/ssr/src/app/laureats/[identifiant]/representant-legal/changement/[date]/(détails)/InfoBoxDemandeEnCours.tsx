import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

type InfoBoxDemandeEnCourssProps = { lien: string };

export const InfoBoxDemandeEnCours: FC<InfoBoxDemandeEnCourssProps> = ({ lien }) => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Une demande de changement de représentant légal est en cours,{' '}
        <Link href={lien} aria-label="voir le détail de la demande">
          vous pouvez la retrouver ici
        </Link>
        .
      </div>
    }
  />
);
