import { FC } from 'react';
import Link from 'next/link';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';

import { StatutChangementProducteurBadge } from '../../[identifiant]/producteur/changement/StatutChangementProducteurBadge';

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
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de producteur du projet"
        misÀJourLe={DateTime.bind(enregistréLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.Producteur.changement.détails(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
          enregistréLe.date,
        )}
        aria-label="voir le détail du changement"
      >
        Voir le changement
      </Link>
    }
  >
    <ul className="mt-3 text-sm">
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
    <StatutChangementProducteurBadge />
  </ListItem>
);
