import { FC } from 'react';
import Link from 'next/link';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutChangementReprésentantLégalBadge } from '../StatutChangementReprésentantLégalBadge';

/**
 * @todo À ajouter quand domain est prêt :
export type ReprésentantLégalListItemProps = PlainType<ReprésentantLégal.ListerReprésentantLégalReadModel['items'][number]>; 
 */
export type ChangementReprésentantLégalListItemProps = PlainType<{
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.RawType;
  misÀJourLe: {
    date: string;
  };
}>;

export const ChangementReprésentantLégalListItem: FC<ChangementReprésentantLégalListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  misÀJourLe,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement représentant légal du projet"
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      <Link
        /**
         * @todo À ajouter quand domain est prêt :
         * Route vers la page de détail de la demande de modification du représentant légal
         */
        href={'#'}
        aria-label={`voir le détail du recours en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <StatutChangementReprésentantLégalBadge statut={statut} small />
  </ListItem>
);
