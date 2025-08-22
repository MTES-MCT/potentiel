import Link from 'next/link';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { StatutChangementActionnaireBadge } from '../../[identifiant]/actionnaire/StatutChangementActionnaireBadge';

export type ChangementActionnaireListItemProps = PlainType<
  Lauréat.Actionnaire.ListerChangementActionnaireReadModel['items'][number]
>;

export const ChangementActionnaireListItem: FC<ChangementActionnaireListItemProps> = ({
  identifiantProjet,
  nomProjet,
  statut,
  misÀJourLe,
  demandéLe,
  nouvelActionnaire,
}) => (
  <ListItem
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix={
          statut.statut === 'information-enregistrée'
            ? "Changement d'actionnaire(s) du projet"
            : "Demande de changement d'actionnaire(s) du projet"
        }
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      <Link
        href={Routes.Actionnaire.changement.détails(
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
          Nouvel actionnaire : <span className="font-semibold">{nouvelActionnaire}</span>
        </span>
      </li>
      <li>
        <span>
          Date de la demande :{' '}
          <FormattedDate className="font-semibold" date={DateTime.bind(demandéLe).formatter()} />
        </span>
      </li>
    </ul>
    <StatutChangementActionnaireBadge
      statut={Lauréat.Actionnaire.StatutChangementActionnaire.bind(statut).statut}
      small
    />
  </ListItem>
);
