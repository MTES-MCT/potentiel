import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

import { Candidature } from '@potentiel-domain/projet';

const getTypeActionnariat = (actionnariat?: Candidature.TypeActionnariat.RawType) =>
  actionnariat
    ? actionnariat
        .split('-')
        .map((word) => word[0].toUpperCase())
        .join('')
    : undefined;

type StatutÉliminéBadgeProps = {
  actionnariat?: Candidature.TypeActionnariat.RawType;
};

export const StatutÉliminéBadge: FC<StatutÉliminéBadgeProps> = ({ actionnariat }) => (
  <>
    <Badge small noIcon severity={'error'} className="print:hidden">
      Éliminé
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </Badge>
    <div className="hidden print:block text-theme-black ">
      Éliminé
      {getTypeActionnariat(actionnariat) && ` (${getTypeActionnariat(actionnariat)})`}
    </div>
  </>
);
