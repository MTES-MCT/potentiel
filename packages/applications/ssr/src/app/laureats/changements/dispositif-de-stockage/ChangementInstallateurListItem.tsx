import { FC } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjectListItemHeading } from '@/components/molecules/projet/liste/ProjectListItemHeading';
import { ListItem } from '@/components/molecules/ListItem';
import { StatutDemandeBadge } from '@/components/organisms/demande/StatutDemandeBadge';

import { ChangementDispositifDeStockageListPageProps } from './ChangementInstallateurList.page';

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
    <div>
      Dispositif de stockage :{' '}
      <span className="font-semibold">
        {dispositifDeStockage.installationAvecDispositifDeStockage ? 'avec' : 'sans'}
      </span>
      {dispositifDeStockage.puissanceDuDispositifDeStockageEnKW !== undefined ? (
        <div>
          Puissance du dispositif de stockage :{' '}
          {dispositifDeStockage.puissanceDuDispositifDeStockageEnKW} kW
        </div>
      ) : null}
      {dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh !== undefined ? (
        <div>
          Capacité du dispositif de stockage :{' '}
          {dispositifDeStockage.capacitéDuDispositifDeStockageEnKWh} kWh
        </div>
      ) : null}
    </div>
    <StatutDemandeBadge statut="information-enregistrée" small />
  </ListItem>
);
