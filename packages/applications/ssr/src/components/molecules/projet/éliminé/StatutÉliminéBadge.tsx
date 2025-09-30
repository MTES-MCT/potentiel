import Badge from '@codegouvfr/react-dsfr/Badge';
import { FC } from 'react';

export const StatutÉliminéBadge: FC = () => (
  <>
    <Badge small noIcon severity={'error'} className="print:hidden">
      Éliminé
    </Badge>
    <div className="hidden print:block text-theme-black ">Éliminé</div>
  </>
);
