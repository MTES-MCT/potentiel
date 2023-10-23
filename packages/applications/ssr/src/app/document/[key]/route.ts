import { mediator } from 'mediateur';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { bootstrap } from '@/infrastructure/bootstrap';


bootstrap();

export const GET = async (request: Request, { params: { key } }: { params: { key: string } }) => {
  const documentKey = decodeURI(key);
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
