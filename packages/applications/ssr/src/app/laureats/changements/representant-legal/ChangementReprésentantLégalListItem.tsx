import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

export type ChangementReprésentantLégalListItemProps = PlainType<
  Lauréat.ReprésentantLégal.ListerChangementReprésentantLégalReadModel['items'][number]
>;

export const ChangementReprésentantLégalListItem: FC<ChangementReprésentantLégalListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  miseÀJourLe,
  demandéLe,
}) => (
  <ListItem
    miseÀJourLe={DateTime.bind(miseÀJourLe).formatter()}
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
        }}
        aria-label={`voir le détail de la demande de changement de représentant légal pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <StatutDemandeBadge
      statut={Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.bind(statut).formatter()}
      small
    />
  </ListItem>
);
