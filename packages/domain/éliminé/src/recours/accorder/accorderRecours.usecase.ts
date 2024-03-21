// Third party
import { Message, MessageHandler, mediator } from "mediateur";

// Workspaces
import { DateTime, IdentifiantProjet } from "@potentiel-domain/common";
import { IdentifiantUtilisateur } from "@potentiel-domain/utilisateur";
import {
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
} from "@potentiel-domain/document";

// Package
import { AccorderRecoursCommand } from "./accorderRecours.command";
import * as TypeDocumentRecours from "../typeDocumentRecours.valueType";

export type AccorderRecoursUseCase = Message<
  "Eliminé.Recours.UseCase.Accorder",
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderRecoursUseCase = () => {
  const runner: MessageHandler<AccorderRecoursUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentRecours.recoursAccordé.formatter(),
      dateAccordValue,
      format
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      identifiantProjetValue
    );
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: "Document.Command.EnregistrerDocumentProjet",
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderRecoursCommand>({
      type: "Eliminé.Recours.Command.Accorder",
      data: {
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register("Eliminé.Recours.UseCase.Accorder", runner);
};
