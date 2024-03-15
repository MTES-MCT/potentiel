import { Message, MessageHandler, mediator } from "mediateur";
import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";
import { SupprimerGarantiesFinancièresCommand } from "./supprimerGarantiesFinancières.command";

export type SupprimerGarantiesFinancièresUseCase = Message<
  "Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières",
  {
    identifiantProjetValue: string;
    suppriméLeValue: string;
    suppriméParValue: string;
  }
>;

export const registerSupprimerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<SupprimerGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    suppriméLeValue,
    suppriméParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      identifiantProjetValue
    );
    const suppriméLe = DateTime.convertirEnValueType(suppriméLeValue);
    const suppriméPar =
      IdentifiantUtilisateur.convertirEnValueType(suppriméParValue);

    await mediator.send<SupprimerGarantiesFinancièresCommand>({
      type: "Lauréat.GarantiesFinancières.Command.SupprimerGarantiesFinancières",
      data: {
        identifiantProjet,
        suppriméLe,
        suppriméPar,
      },
    });
  };
  mediator.register(
    "Lauréat.GarantiesFinancières.UseCase.SupprimerGarantiesFinancières",
    runner
  );
};
