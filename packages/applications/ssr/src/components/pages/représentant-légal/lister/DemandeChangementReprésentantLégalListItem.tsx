import { FC } from 'react';
import Link from 'next/link';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutChangementReprésentantLégalBadge } from '../StatutChangementReprésentantLégalBadge';

export type DemandeChangementReprésentantLégalListItemProps = PlainType<
  ReprésentantLégal.ListerDemandeChangementReprésentantLégalReadModel['items'][number]
>;
export const DemandeChangementReprésentantLégalListItem: FC<
  DemandeChangementReprésentantLégalListItemProps
> = ({ identifiantProjet, nomProjet, statut, demandéLe }) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement représentant légal du projet"
        misÀJourLe={DateTime.bind(demandéLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.ReprésentantLégal.demandeChangement.détail(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
        )}
        aria-label={`voir le détail du recours en statut ${statut} pour le projet ${nomProjet}`}
      >
        voir le détail
      </Link>
    }
  >
    <StatutChangementReprésentantLégalBadge statut={statut.statut} small />
  </ListItem>
);
