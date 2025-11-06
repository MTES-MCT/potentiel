import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { ChangementNomProjetListPageProps } from './ChangementNomProjetList.page';

export type ChangementNomProjetListItemProps =
  ChangementNomProjetListPageProps['list']['items'][number];

export const ChangementNomProjetListItem: FC<ChangementNomProjetListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
}) => (
  <ListItem
    miseÀJourLe={DateTime.bind(enregistréLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de nom du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Lauréat.changement.nomProjet.détails(
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
        Nouveau nom de projet : <span className="font-semibold">{nomProjet}</span>
      </li>
    </ul>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
