import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import { TypeDocumentDemandeDélai } from '../..';
import { IdentifiantProjet } from '../../../..';

import { RejeterDemandeDélaiCommand } from './rejeterDemandeDélai.command';

export type RejeterDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.RejeterDemandeDélai',
  {
    identifiantProjetValue: string;
    dateRejetValue: string;
    identifiantUtilisateurValue: string;
    réponseSignéeValue: { content: ReadableStream; format: string };
    rôleUtilisateurValue: string;
  }
>;

export const registerRejeterDemandeDélaiUseCase = () => {
  const runner: MessageHandler<RejeterDemandeDélaiUseCase> = async ({
    identifiantProjetValue,
    dateRejetValue,
    identifiantUtilisateurValue,
    réponseSignéeValue: { format, content },
    rôleUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateRejet = DateTime.convertirEnValueType(dateRejetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);
    const réponseSignée = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentDemandeDélai.demandeRejetée.formatter(),
      dateRejet.formatter(),
      format,
    );
    const rôleUtilisateur = Role.convertirEnValueType(rôleUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: { content, documentProjet: réponseSignée },
    });

    await mediator.send<RejeterDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.RejeterDemandeDélai',
      data: {
        dateRejet,
        identifiantUtilisateur,
        identifiantProjet,
        réponseSignée,
        rôleUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Délai.UseCase.RejeterDemandeDélai', runner);
};
