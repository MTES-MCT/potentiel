import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Link } from '@/components/atoms/LinkNoPrefetch';

type InfoBoxDemandeEnCourssProps = { lien: string };

export const InfoBoxDemandeEnCours: FC<InfoBoxDemandeEnCourssProps> = ({ lien }) => (
  <Notice
    severity="info"
    title="Demande en cours"
    description={
      <span>
        <br />
        Une demande de changement de représentant légal est en cours,{' '}
        <Link href={lien} aria-label="voir le détail de la demande">
          vous pouvez la retrouver ici
        </Link>
        .
      </span>
    }
  />
);
