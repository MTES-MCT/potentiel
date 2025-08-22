import { extname } from 'path';

import { Message, MessageHandler, mediator } from 'mediateur';
import { contentType } from 'mime-types';

import { Option } from '@potentiel-libraries/monads';

export type ConsulterDocumentProjetReadModel = {
  content: ReadableStream;
  format: string;
};

export type ConsulterDocumentProjetQuery = Message<
  'Document.Query.ConsulterDocumentProjet',
  {
    documentKey: string;
  },
  Option.Type<ConsulterDocumentProjetReadModel>
>;

export type RécupérerDocumentProjetPort = (documentKey: string) => Promise<ReadableStream>;

export type ConsulterDocumentProjetDependencies = {
  récupérerDocumentProjet: RécupérerDocumentProjetPort;
};

export const registerConsulterDocumentProjetQuery = ({
  récupérerDocumentProjet,
}: ConsulterDocumentProjetDependencies) => {
  const handler: MessageHandler<ConsulterDocumentProjetQuery> = async ({ documentKey }) => {
    try {
      const content = await récupérerDocumentProjet(documentKey);
      const format = contentType(extname(documentKey)) as string;

      return {
        content,
        format,
      };
    } catch {
      return Option.none;
    }
  };

  mediator.register('Document.Query.ConsulterDocumentProjet', handler);
};
