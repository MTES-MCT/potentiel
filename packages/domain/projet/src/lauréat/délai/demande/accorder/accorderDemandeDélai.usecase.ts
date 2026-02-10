import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { TypeDocumentDemandeDélai } from '../../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';

import { AccorderDemandeDélaiCommand } from './accorderDemandeDélai.command.js';

export type AccorderDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.AccorderDemandeDélai',
  {
    identifiantProjetValue: string;
    dateAccordValue: string;
    nombreDeMois: number;
    identifiantUtilisateurValue: string;
    réponseSignéeValue: { content: ReadableStream; format: string };
    rôleUtilisateurValue: string;
  }
>;

export const registerAccorderDemandeDélaiUseCase = () => {
  const runner: MessageHandler<AccorderDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    dateAccordValue,
    nombreDeMois,
    identifiantUtilisateurValue,
    réponseSignéeValue: { format, content },
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAccord = DateTime.convertirEnValueType(dateAccordValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentDemandeDélai.demandeAccordée.formatter(),
      dateAccord.formatter(),
      format,
    );
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: { content, documentProjet: réponseSignée },
    });

    await mediator.send<AccorderDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.AccorderDemandeDélai',
      data: {
        dateAccord,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
        nombreDeMois,
        rôleUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Délai.UseCase.AccorderDemandeDélai', runner);
};
