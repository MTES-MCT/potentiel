import Button from '@codegouvfr/react-dsfr/Button';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';
import type { ChangementProducteurListPageProps } from './ChangementProducteurList.page';

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
    miseÀJourLe={DateTime.bind(enregistréLe).formatter()}
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
