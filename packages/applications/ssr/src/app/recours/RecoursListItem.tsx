import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import type { Éliminé } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { StatutRecoursBadge } from '../elimine/[identifiant]/recours/(détails)/StatutRecoursBadge';

export type RecoursListItemProps = PlainType<
  Éliminé.Recours.ListerRecoursReadModel['items'][number]
>;

export const RecoursListItem: FC<RecoursListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  misÀJourLe,
}) => {
  return (
    <ListItem
      heading={
        <ProjectListItemHeading
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          prefix="Recours du projet"
          misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
        />
      }
      actions={
        <Link
          href={Routes.Recours.détail(IdentifiantProjet.bind(identifiantProjet).formatter())}
          aria-label={`voir le détail du recours en statut ${statut} pour le projet ${nomProjet}`}
        >
          voir le détail
        </Link>
      }
    >
      <StatutRecoursBadge statut={statut.value} small />
    </ListItem>
  );
};
