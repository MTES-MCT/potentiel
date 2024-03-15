import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";
import { DomainEvent, NotFoundError } from "@potentiel-domain/core";

import { GarantiesFinancièresAggregate } from "../garantiesFinancières.aggregate";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";

export type GarantiesFinancièresSuppriméesEvent = DomainEvent<
  "GarantiesFinancièresSupprimées-V1",
  {
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméLe: DateTime.RawType;
    suppriméPar?: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  suppriméLe: DateTime.ValueType;
  suppriméPar?: IdentifiantUtilisateur.ValueType;
};

export async function supprimer(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, suppriméLe, suppriméPar }: Options
) {
  if (!this.actuelles) {
    throw new AucunesGarantiesFinancièresValidées();
  }

  const event: GarantiesFinancièresSuppriméesEvent = {
    type: "GarantiesFinancièresSupprimées-V1",
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      suppriméLe: suppriméLe.formatter(),
      suppriméPar: suppriméPar && suppriméPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyGarantiesFinancièresSupprimées(
  this: GarantiesFinancièresAggregate
) {
  this.actuelles = undefined;
}

class AucunesGarantiesFinancièresValidées extends NotFoundError {
  constructor() {
    super(`Il n'y a aucunes garanties financières validées pour ce projet`);
  }
}
