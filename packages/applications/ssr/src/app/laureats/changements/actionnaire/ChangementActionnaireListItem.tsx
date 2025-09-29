import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { FormattedDate } from '@/components/atoms/FormattedDate';

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
      <Button
        linkProps={{
          href: Routes.Actionnaire.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandéLe.date,
          ),
          prefetch: false,
        }}
        aria-label="voir le détail de la demande"
      >
        Voir la demande
      </Button>
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
