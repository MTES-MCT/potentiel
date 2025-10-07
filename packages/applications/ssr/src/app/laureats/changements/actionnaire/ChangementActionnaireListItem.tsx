import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { StatutDemandeBadge } from '@/components/organisms/StatutDemande';

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
    misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix={
          statut.statut === 'information-enregistrée'
            ? "Changement d'actionnaire(s) du projet"
            : "Demande de changement d'actionnaire(s) du projet"
        }
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Actionnaire.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandéLe.date,
          ),
        }}
        aria-label={
          statut.statut === 'information-enregistrée'
            ? `voir le détail du changement d'actionnaire pour le projet ${nomProjet}`
            : `voir le détail de la demande de changement d'actionnaire pour le projet ${nomProjet}`
        }
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
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
    <StatutDemandeBadge
      statut={Lauréat.Actionnaire.StatutChangementActionnaire.bind(statut).statut}
      small
    />
  </ListItem>
);
