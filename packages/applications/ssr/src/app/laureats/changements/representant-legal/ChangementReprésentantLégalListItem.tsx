import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

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
    misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement du représentant légal du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.ReprésentantLégal.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandéLe,
          ),
          prefetch: false,
        }}
        aria-label={`voir le détail du changement de représentant légal pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <StatutChangementReprésentantLégalBadge
      statut={Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.bind(statut).formatter()}
      small
    />
  </ListItem>
);
