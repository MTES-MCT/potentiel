import { match, P } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { mapToChangementInstallateurEnregistréTimelineItemsProps } from '../../../../(historique)/events/mapToChangementInstallateurEnregistréTimelineItemsProps';
import { mapToInstallateurModifiéTimelineItemsProps } from '../../../../(historique)/events/mapToInstallateurModifiéTimelineItemsProps';
import { mapToInstallateurImportéTimelineItemProps } from './events/mapToInstallateurImportéTimelineItemProps';

type MapToInstallateurTimelineItemProps = (
  readmodel: Lauréat.Installation.HistoriqueInstallationProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) => TimelineItemProps | null;

export const mapToInstallateurTimelineItemProps: MapToInstallateurTimelineItemProps = (
  readmodel,
  rôleUtilisateur,
) =>
  match(readmodel)
    .with({ type: 'InstallationImportée-V1' }, (readmodel) =>
      mapToInstallateurImportéTimelineItemProps(readmodel),
    )
    .with({ type: 'InstallateurModifié-V1' }, (readmodel) =>
      mapToInstallateurModifiéTimelineItemsProps(readmodel),
    )
    .with({ type: 'ChangementInstallateurEnregistré-V1' }, (readmodel) =>
      mapToChangementInstallateurEnregistréTimelineItemsProps(readmodel, rôleUtilisateur),
    )
    .with(
      {
        type: P.union(
          'DispositifDeStockageModifié-V1',
          'TypologieInstallationModifiée-V1',
          'ChangementDispositifDeStockageEnregistré-V1',
        ),
      },
      () => null,
    )
    .exhaustive();
