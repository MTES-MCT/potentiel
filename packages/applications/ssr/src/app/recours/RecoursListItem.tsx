import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
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
      misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      heading={
        <ProjectListItemHeading
          nomProjet={nomProjet}
          identifiantProjet={identifiantProjet}
          prefix="Recours du projet"
        />
      }
      actions={
        <Button
          linkProps={{
            href: Routes.Recours.détail(IdentifiantProjet.bind(identifiantProjet).formatter()),
          }}
          aria-label={`voir le détail du recours pour le projet ${nomProjet}`}
        >
          Consulter
        </Button>
      }
    >
      <StatutRecoursBadge statut={statut.value} small />
    </ListItem>
  );
};
