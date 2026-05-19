import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import type { ChangementInstallateurListPageProps } from './ChangementInstallateurList.page';

export type ChangemenInstallateurListItemProps =
  ChangementInstallateurListPageProps['list']['items'][number];

export const ChangementInstallateurListItem: FC<ChangemenInstallateurListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
  installateur,
}) => (
  <ListItem
    miseÀJourLe={DateTime.bind(enregistréLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement d'installateur"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Installation.changement.installateur.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            enregistréLe.date,
          ),
        }}
        aria-label={`voir le détail du changement pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <div>
      Nouvel installateur : <span className="font-semibold">{installateur}</span>
    </div>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
