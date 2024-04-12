import { Message, MessageHandler, mediator } from 'mediateur';
import { contentType } from 'mime-types';
import { extname } from 'path';

export type ConsulterDocumentProjetReadModel = {
  content: ReadableStream;
  format: string;
};

export type ConsulterDocumentProjetQuery = Message<
  'Document.Query.ConsulterDocumentProjet',
  {
    documentKey: string;
  },
  ConsulterDocumentProjetReadModel
>;

export type RécupérerDocumentProjetPort = (documentKey: string) => Promise<ReadableStream>;

export type ConsulterDocumentProjetDependencies = {
  récupérerDocumentProjet: RécupérerDocumentProjetPort;
};

export const registerConsulterDocumentProjetQuery = ({
  récupérerDocumentProjet,
}: ConsulterDocumentProjetDependencies) => {
  const handler: MessageHandler<ConsulterDocumentProjetQuery> = async ({ documentKey }) => {
    const content = await récupérerDocumentProjet(documentKey);
    const format = contentType(extname(documentKey)) as string;

    return {
      content,
      format,
    };
  };

  mediator.register('Document.Query.ConsulterDocumentProjet', handler);
};
