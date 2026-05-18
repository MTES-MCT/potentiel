import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ListItem } from '@/components/molecules/ListItem';
import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { DétailsDispositifDeStockage } from '../../[identifiant]/installation/dispositif-de-stockage/DétailsDispositifDeStockage';
import { ChangementDispositifDeStockageListPageProps } from './ChangementDispositifDeStockageList.page';

export type ChangemenDispositifDeStockageListItemProps =
  ChangementDispositifDeStockageListPageProps['list']['items'][number];

export const ChangementDispositifDeStockageListItem: FC<
  ChangemenDispositifDeStockageListItemProps
> = ({ identifiantProjet, nomProjet, enregistréLe, dispositifDeStockage }) => (
  <ListItem
    miseÀJourLe={DateTime.bind(enregistréLe).formatter()}
    heading={
      <ProjectListItemHeading
        nomProjet={nomProjet}
        identifiantProjet={identifiantProjet}
        prefix="Changement de dispositif de stockage"
      />
    }
    actions={
      <Button
        linkProps={{
          href: Routes.Installation.changement.dispositifDeStockage.détails(
            IdentifiantProjet.bind(identifiantProjet).formatter(),
            enregistréLe.date,
          ),
        }}
        aria-label={`voir le détail du changement pour le projet ${nomProjet}`}
      >
        Consulter
      </Button>
    }
  >
    <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
