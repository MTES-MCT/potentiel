import { Message, MessageHandler, mediator } from 'mediateur';

export type ConsulterDocumentProjetQuery = Message<
  'CONSULTER_DOCUMENT_PROJET',
  {
    key: string;
  },
  ReadableStream
>;

export type RécupérerDocumentPort = (key: string) => Promise<ReadableStream>;

export type ConsulterDocumentProjetDependencies = {
  récupérerDocument: RécupérerDocumentPort;
};

export const registerConsulterDocumentProjetQuery = ({
  récupérerDocument,
}: ConsulterDocumentProjetDependencies) => {
  const handler: MessageHandler<ConsulterDocumentProjetQuery> = async ({ key: documentKey }) =>
    récupérerDocument(documentKey);
  mediator.register('CONSULTER_DOCUMENT_PROJET', handler);
};
