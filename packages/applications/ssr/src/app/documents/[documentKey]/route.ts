import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { mediator } from 'mediateur';

type DocumentKeyParameter = {
  params: {
    documentKey: string;
  };
};

export const GET = async (request: Request, { params: { documentKey } }: DocumentKeyParameter) => {
  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'CONSULTER_DOCUMENT_PROJET',
    data: {
      documentKey,
    },
  });

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
    },
  });
};
