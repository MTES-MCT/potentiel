import { Message, MessageHandler, mediator } from "mediateur";

import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";

import { LoadAggregate } from "@potentiel-domain/core";
import { loadGarantiesFinancièresFactory } from "../garantiesFinancières.aggregate";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";

export type SupprimerGarantiesFinancièresCommand = Message<
  "Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancières",
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméPar: IdentifiantUtilisateur.ValueType;
    suppriméLe: DateTime.ValueType;
  }
>;

export const registerSupprimerGarantiesFinancièresCommand = (
  loadAggregate: LoadAggregate
) => {
  const loadGarantiesFinancières =
    loadGarantiesFinancièresFactory(loadAggregate);
  const handler: MessageHandler<SupprimerGarantiesFinancièresCommand> = async ({
    identifiantProjet,
    suppriméLe,
    suppriméPar,
  }) => {
    const garantiesFinancières = await loadGarantiesFinancières(
      identifiantProjet,
      false
    );
    await garantiesFinancières.supprimer({
      identifiantProjet,
      suppriméLe,
      suppriméPar,
    });
  };
  mediator.register(
    "Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancières",
    handler
  );
};
