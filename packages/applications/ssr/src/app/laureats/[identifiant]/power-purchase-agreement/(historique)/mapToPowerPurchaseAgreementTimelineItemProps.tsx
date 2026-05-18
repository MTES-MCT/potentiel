import { match } from "ts-pattern";

import { Lauréat } from "@potentiel-domain/projet";

import { TimelineItemProps } from "@/components/organisms/timeline";

import { mapToPowerPurchaseAgreementSignaléTimelineItemProps } from "./events";
import { mapToSignalementPowerPurchaseAgreementAnnuléTimelineItemProps } from "./events/mapToSignalementPowerPurchaseAgreementAnnuléTimelineItemProps";

type MapToPowerPurchaseAgreementTimelineItemProps = (
  readmodel: Lauréat.PowerPurchaseAgreement.HistoriquePowerPurchaseAgreementProjetListItemReadModel,
) => TimelineItemProps;

export const mapToPowerPurchaseAgreementTimelineItemProps: MapToPowerPurchaseAgreementTimelineItemProps =
  (readmodel) =>
    match(readmodel)
      .with({ type: "PowerPurchaseAgreementSignalé-V1" }, (readmodel) =>
        mapToPowerPurchaseAgreementSignaléTimelineItemProps(readmodel),
      )
      .with(
        { type: "SignalementPowerPurchaseAgreementAnnulé-V1" },
        (readmodel) =>
          mapToSignalementPowerPurchaseAgreementAnnuléTimelineItemProps(
            readmodel,
          ),
      )
      .exhaustive();
