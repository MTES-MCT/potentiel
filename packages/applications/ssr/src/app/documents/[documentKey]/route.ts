import { mediator } from 'mediateur';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

type DocumentKeyParameter = {
  params: {
    documentKey: string;
  };
};

export const GET = async (request: Request, { params: { documentKey } }: DocumentKeyParameter) => {
  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
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
