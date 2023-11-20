import { mediator } from 'mediateur';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

export const GET = async (
  request: Request,
  { params: { documentKey } }: { params: { documentKey: string } },
) => {
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
