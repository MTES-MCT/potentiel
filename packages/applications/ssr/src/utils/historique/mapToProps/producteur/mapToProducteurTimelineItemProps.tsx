import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/Timeline';
import { IconProps } from '@/components/atoms/Icon';

import { demandeIcon } from '../icons';

import { mapToChangementProducteurEnregistréTimelineItemProps } from './events/mapToChangementProducteurEnregistréTimelineItemProps';
import { mapToProducteurModifiéTimelineItemsProps } from './events/mapToProducteurModifiéTimelineItemsProps';
import { mapToProducteurImportéTimelineItemProps } from './events/mapToProducteurImportéTimelineItemProps';

export type MapToProducteurTimelineItemProps = (
  readmodel: Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel,
  icon: IconProps,
) => TimelineItemProps;

export const mapToProducteurTimelineItemProps = (
  readmodel: Lauréat.Producteur.HistoriqueProducteurProjetListItemReadModel,
) =>
  match(readmodel)
    .returnType<TimelineItemProps>()
    .with({ type: 'ProducteurImporté-V1' }, (readmodel) =>
      mapToProducteurImportéTimelineItemProps(readmodel, demandeIcon),
    )
    .with({ type: 'ProducteurModifié-V1' }, (readmodel) =>
      mapToProducteurModifiéTimelineItemsProps(readmodel, demandeIcon),
    )
    .with({ type: 'ChangementProducteurEnregistré-V1' }, (readmodel) =>
      mapToChangementProducteurEnregistréTimelineItemProps(readmodel, demandeIcon),
    )
    .exhaustive();
