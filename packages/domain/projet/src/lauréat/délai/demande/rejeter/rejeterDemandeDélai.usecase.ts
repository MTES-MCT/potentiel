import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';

import { TypeDocumentDemandeDélai } from '../..';
import { IdentifiantProjet } from '../../../..';

import { RejeterDemandeDélaiCommand } from './rejeterDemandeDélai.command';

export type RejeterDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.RejeterDemandeDélai',
  {
    identifiantProjetValue: string;
    rejetéeLeValue: string;
    rejetéeParValue: string;
    réponseSignéeValue: { content: ReadableStream; format: string };
  }
>;

export const registerRejeterDemandeDélaiUseCase = () => {
  const runner: MessageHandler<RejeterDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    rejetéeLeValue,
    rejetéeParValue,
    réponseSignéeValue: { format, content },
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const rejetéeLe = DateTime.convertirEnValueType(rejetéeLeValue);
    const rejetéePar = Email.convertirEnValueType(rejetéeParValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentDemandeDélai.demandeRejetée.formatter(),
      rejetéeLe.formatter(),
      format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: { content, documentProjet: réponseSignée },
    });

    await mediator.send<RejeterDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.RejeterDemandeDélai',
      data: { rejetéeLe, rejetéePar, identifiantProjet, réponseSignée },
    });
  };
  mediator.register('Lauréat.Délai.UseCase.RejeterDemandeDélai', runner);
};
