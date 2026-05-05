import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { mapToPowerPurchaseAgreementSignaléTimelineItemProps } from './events';
import { mapToPowerPurchaseAgreementAnnuléTimelineItemProps } from './events/mapToPowerPurchaseAgreementAnnuléTimelineItemProps';

type MapToPowerPurchaseAgreementTimelineItemProps = (
  readmodel: Lauréat.PowerPurchaseAgreement.HistoriquePowerPurchaseAgreementProjetListItemReadModel,
) => TimelineItemProps;

export const mapToPowerPurchaseAgreementTimelineItemProps: MapToPowerPurchaseAgreementTimelineItemProps =
  (readmodel) =>
    match(readmodel)
      .with({ type: 'PowerPurchaseAgreementSignalé-V1' }, (readmodel) =>
        mapToPowerPurchaseAgreementSignaléTimelineItemProps(readmodel),
      )
      .with({ type: 'PowerPurchaseAgreementAnnulé-V1' }, (readmodel) =>
        mapToPowerPurchaseAgreementAnnuléTimelineItemProps(readmodel),
      )
      .exhaustive();
