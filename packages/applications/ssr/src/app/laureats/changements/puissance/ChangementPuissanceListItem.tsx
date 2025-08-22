import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { StatutChangementPuissanceBadge } from '../../[identifiant]/puissance/changement/[date]/StatutChangementPuissanceBadge';
import type { ChangementPuissanceListPageProps } from './ChangementPuissanceList.page';

export type ChangementPuissanceListItemProps =
  ChangementPuissanceListPageProps['list']['items'][number];

export const ChangementPuissanceListItem: FC<ChangementPuissanceListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut: { statut },
  misÀJourLe,
  demandéLe,
  nouvellePuissance,
  unitéPuissance,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix={
          statut === 'information-enregistrée'
            ? 'Changement de puissance du projet'
            : 'Demande de changement de puissance du projet'
        }
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.Puissance.changement.détails(
          IdentifiantProjet.bind(identifiantProjet).formatter(),
          demandéLe.date,
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
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {nouvellePuissance} {unitéPuissance}
          </span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande :{' '}
          <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} />
        </span>
      </li>
    </ul>
    <StatutChangementPuissanceBadge statut={statut} small />
  </ListItem>
);
