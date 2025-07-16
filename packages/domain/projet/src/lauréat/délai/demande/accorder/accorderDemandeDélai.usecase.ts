import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentDemandeDélai } from '../..';
import { IdentifiantProjet } from '../../../..';

import { AccorderDemandeDélaiCommand } from './accorderDemandeDélai.command';

export type AccorderDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.AccorderDemandeDélai',
  {
    identifiantProjetValue: string;
    dateAccordValue: string;
    identifiantUtilisateurValue: string;
    réponseSignéeValue: { content: ReadableStream; format: string };
  }
>;

export const registerAccorderDemandeDélaiUseCase = () => {
  const runner: MessageHandler<AccorderDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    dateAccordValue,
    identifiantUtilisateurValue,
    réponseSignéeValue: { format, content },
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

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: { content, documentProjet: réponseSignée },
    });

    await mediator.send<AccorderDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.AccorderDemandeDélai',
      data: { dateAccord, identifiantUtilisateur, identifiantProjet, réponseSignée },
    });
  };
  mediator.register('Lauréat.Délai.UseCase.AccorderDemandeDélai', runner);
};
