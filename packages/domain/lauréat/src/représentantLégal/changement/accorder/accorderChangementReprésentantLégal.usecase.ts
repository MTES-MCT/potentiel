// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
// eslint-disable-next-line import/order
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import * as TypeDocumentChangementReprésentantLégal from '../typeDocumentChangementReprésentantLégal.valueType';
import { TypeReprésentantLégal } from '../..';

import { AccorderChangementReprésentantLégalCommand } from './accorderChangementReprésentantLégal.command';

export type AccorderChangementReprésentantLégalUseCase = Message<
  'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    nomReprésentantLégalValue: string;
    typeReprésentantLégalValue: string;
    dateAccordValue: string;
    réponseSignéeValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerAccorderChangementReprésentantLégalUseCase = () => {
  const runner: MessageHandler<AccorderChangementReprésentantLégalUseCase> = async ({
    identifiantUtilisateurValue,
    dateAccordValue,
    réponseSignéeValue: { content, format },
    identifiantProjetValue,
    nomReprésentantLégalValue,
    typeReprésentantLégalValue,
  }) => {
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentChangementReprésentantLégal.changementAccordé.formatter(),
      dateAccordValue,
      format,
    );

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content,
        documentProjet: réponseSignée,
      },
    });

    await mediator.send<AccorderChangementReprésentantLégalCommand>({
      type: 'Lauréat.ReprésentantLégal.Command.AccorderChangementReprésentantLégal',
      data: {
        nomReprésentantLégal: nomReprésentantLégalValue,
        typeReprésentantLégal: TypeReprésentantLégal.convertirEnValueType(
          typeReprésentantLégalValue,
        ),
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
      },
    });
  };
  mediator.register(
    'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
    runner,
  );
};
