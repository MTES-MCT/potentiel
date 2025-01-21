import { FC } from 'react';
import Link from 'next/link';

import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutChangementReprésentantLégalBadge } from '../StatutChangementReprésentantLégalBadge';

export type ChangementReprésentantLégalListItemProps = PlainType<
  ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items'][number]
>;

export const ChangementReprésentantLégalListItem: FC<ChangementReprésentantLégalListItemProps> = ({
  identifiantChangement,
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
        prefix="Changement du représentant légal du projet"
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.ReprésentantLégal.changement.détail(identifiantChangement)}
        aria-label={`voir le détail du changement de représentant légal en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <StatutChangementReprésentantLégalBadge
      statut={ReprésentantLégal.StatutChangementReprésentantLégal.bind(statut).formatter()}
      small
    />
  </ListItem>
);
