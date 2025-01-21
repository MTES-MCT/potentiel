import { FC } from 'react';
import Link from 'next/link';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Actionnaire } from '@potentiel-domain/laureat';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { StatutChangementActionnaireBadge } from './StatutChangementActionnaireBadge';

export type ChangementActionnaireListItemProps = PlainType<
  Actionnaire.ListerChangementActionnaireReadModel['items'][number]
>;

// TODO: remettre le lien vers l'action pour tous les statuts
// une fois que l'historique sera intégré
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
            ? "Modification de l'actionnariat du projet"
            : "Demande de changement de l'actionnariat du projet"
        }
        misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
      />
    }
    actions={
      statut.statut === 'demandé' && (
        <Link
          href={Routes.Actionnaire.changement.détail(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
          )}
          aria-label={`voir le détail de la demande de changement de l'actionnaire pour le projet ${nomProjet}`}
        >
          voir le détail
        </Link>
      )
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
      statut={Actionnaire.StatutChangementActionnaire.bind(statut).statut}
      small
    />
  </ListItem>
);
