import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

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
    misÀJourLe={DateTime.bind(misÀJourLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Demande de délai du projet"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Délai.détail(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            DateTime.bind(demandéLe).formatter(),
          ),
          prefetch: false,
        }}
        aria-label={`voir le détail de la demande de délai pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <ul className="text-sm">
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
