import { FC } from 'react';
import Link from 'next/link';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { PlainType } from '@potentiel-domain/core';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { StatutDemandeDélaiBadge } from '../../[identifiant]/delai/[date]/StatutDemandeDélaiBadge';

export type DemandeDélaiListItemProps = PlainType<
  Lauréat.Délai.ListerDemandeDélaiReadModel['items'][number]
>;

export const DemandeDélaiListItem: FC<DemandeDélaiListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut: { statut },
  misÀJourLe,
  demandéLe,
  nombreDeMois,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Demande de délai du projet"
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.Délai.détail(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
          DateTime.bind(demandéLe).formatter(),
        )}
        aria-label="voir le détail de la demande"
      >
        Voir la demande
      </Link>
    }
  >
    <ul className="mt-3 text-sm">
      <li>
        <span>
          Délai demandé : <span className="font-semibold">{nombreDeMois} mois</span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande :{' '}
          <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} />
        </span>
      </li>
    </ul>
    <StatutDemandeDélaiBadge statut={statut} small />
  </ListItem>
);
