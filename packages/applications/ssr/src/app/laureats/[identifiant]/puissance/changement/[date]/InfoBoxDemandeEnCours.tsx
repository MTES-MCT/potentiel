import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Link } from '@/components/atoms/LinkNoPrefetch';

type Props = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
  dateDemandeEnCours: string;
};

export const InfoBoxDemandeEnCours: FC<Props> = ({
  identifiantProjet,
  dateDemandeEnCours,
}: Props) => (
  <Notice
    severity="info"
    title="Demande en cours"
    description={
      <span>
        <br />
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
      </span>
    }
  />
);
