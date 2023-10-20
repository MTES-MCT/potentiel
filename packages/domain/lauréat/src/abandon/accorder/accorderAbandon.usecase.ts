import { Message, MessageHandler, mediator } from 'mediateur';



type AccorderAbandonUseCaseData = {
  content: ReadableStream;
  identifiantProjet: string;
  formatRéponseSignée: string;
  accordéPar: string;
};

export type AccorderAbandonUseCase = Message<
  'ACCORDER_ABANDON_USECASE',
  AccorderAbandonUseCaseData
>;

export const registerAccorderAbandonUseCase = () => {
  const runner: MessageHandler<AccorderAbandonUseCase> = async ({
    accordéPar,
    content,
    formatRéponseSignée,
    identifiantProjet,
  }) => {
    // await mediator.send<EnregistrerDocumentProjetCommand>({
    //   type: 'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
    //   data: {
    //     content,
    //     documentProjet: DocumentProjet.convertirEnValueType(identifiantProjet, '')
    //   }
    // })
    // await mediator.send<AccorderAbandonCommand>({
    //   type: 'ACCORDER_ABANDON_COMMAND',
    //   data: {
    //     accordéPar: IdentifiantUtilisateur.convertirEnValueType(accordéPar),
    //     identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    //     formatRéponseSignée
    //   }
    // });
  };
  mediator.register('ACCORDER_ABANDON_USECASE', runner);
};
