import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { ChangementProducteurListPageProps } from './ChangementProducteurList.page';

export type ChangementProducteurListItemProps =
  ChangementProducteurListPageProps['list']['items'][number];

export const ChangementProducteurListItem: FC<ChangementProducteurListItemProps> = ({
  identifiantProjet,
  nomProjet,
  enregistréLe,
  ancienProducteur,
  nouveauProducteur,
}) => (
  <ListItem
    misÀJourLe={DateTime.bind(enregistréLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de producteur du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Producteur.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            enregistréLe.date,
          ),
        }}
        aria-label={`voir le détail du changement de producteur pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
      <li>
        <span>
          Ancien producteur : <span className="font-semibold">{ancienProducteur}</span>
        </span>
      </li>
      <li>
        <span>
          Nouveau producteur : <span className="font-semibold">{nouveauProducteur}</span>
        </span>
      </li>
    </ul>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
