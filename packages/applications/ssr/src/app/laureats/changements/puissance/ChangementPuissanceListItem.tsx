import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { FormattedDate } from '@/components/atoms/FormattedDate';

import { StatutChangementPuissanceBadge } from '../../[identifiant]/puissance/changement/[date]/StatutChangementPuissanceBadge';

import { ChangementPuissanceListPageProps } from './ChangementPuissanceList.page';

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
    misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix={
          statut === 'information-enregistrée'
            ? 'Changement de puissance du projet'
            : 'Demande de changement de puissance du projet'
        }
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Puissance.changement.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            demandéLe.date,
          ),
          prefetch: false,
        }}
        aria-label={`voir le détail de la demande de changement de puissance pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <div>
      <ul className="text-sm">
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
    </div>
  </ListItem>
);
