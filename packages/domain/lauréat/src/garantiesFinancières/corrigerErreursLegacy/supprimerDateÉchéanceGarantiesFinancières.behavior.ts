import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";
import { DomainEvent } from "@potentiel-domain/core";

export type DateÉchéanceGarantiesFinancièresSuppriméeEvent = DomainEvent<
  "DateÉchéanceGarantiesFinancièresSupprimée-V1",
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
  }
>;
