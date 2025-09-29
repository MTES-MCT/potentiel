import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

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
        <Button
          linkProps={{
            href: Routes.Recours.détail(IdentifiantProjet.bind(identifiantProjet).formatter()),
            prefetch: false,
          }}
          aria-label={`voir le détail du recours en statut ${statut} pour le projet ${nomProjet}`}
        >
          voir le détail
        </Button>
      }
    >
      <StatutRecoursBadge statut={statut.value} small />
    </ListItem>
  );
};
