import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { ChangementInstallateurListPageProps } from './ChangementInstallateurList.page';

export type ChangemenInstallateurListItemProps =
  ChangementInstallateurListPageProps['list']['items'][number];

export const ChangementInstallateurListItem: FC<ChangemenInstallateurListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
  ancienInstallateur,
  nouvelInstallateur,
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
          href: Routes.Installation.changementInstallateur.détails(
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
    <ul className="text-sm">
      <li>
        Ancien installateur : <span className="font-semibold">{ancienInstallateur}</span>
      </li>
      <li>
        Nouvel installateur : <span className="font-semibold">{nouvelInstallateur}</span>
      </li>
    </ul>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
