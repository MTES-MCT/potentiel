// Third party
import { Message, MessageHandler, mediator } from "mediateur";

// Workspaces
import { IdentifiantProjet, DateTime } from "@potentiel-domain/common";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";
import { LoadAggregate } from "@potentiel-domain/core";
import { DocumentProjet } from "@potentiel-domain/document";

// Package
import { loadRecoursFactory } from "../recours.aggregate";

export type AccorderRecoursCommand = Message<
  "Eliminé.Recours.Command.Accorder",
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderRecoursCommand = (
  loadAggregate: LoadAggregate
) => {
  const load = loadRecoursFactory(loadAggregate);
  const handler: MessageHandler<AccorderRecoursCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const recours = await load(identifiantProjet);

    await recours.accorder({
      dateAccord,
      identifiantUtilisateur,
      identifiantProjet,
      réponseSignée,
    });
  };
  mediator.register("Eliminé.Recours.Command.Accorder", handler);
};
