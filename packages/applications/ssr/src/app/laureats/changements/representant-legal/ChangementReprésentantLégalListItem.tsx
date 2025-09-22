import Link from 'next/link';
import { FC } from 'react';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';

import { StatutChangementReprésentantLégalBadge } from '../../[identifiant]/representant-legal/changement/[date]/(détails)/StatutChangementReprésentantLégalBadge';

export type ChangementReprésentantLégalListItemProps = PlainType<
  Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items'][number]
>;

export const ChangementReprésentantLégalListItem: FC<ChangementReprésentantLégalListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  misÀJourLe,
  demandéLe,
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
        href={Routes.ReprésentantLégal.changement.détails(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
          demandéLe,
        )}
        aria-label={`voir le détail du changement de représentant légal en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <StatutChangementReprésentantLégalBadge
      statut={Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.bind(statut).formatter()}
      small
    />
  </ListItem>
);
