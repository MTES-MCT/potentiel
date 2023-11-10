import { mediator } from 'mediateur';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { Abandon } from '@potentiel-domain/laureat';

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON',
    data: {
      identifiantProjetValue: identifiant,
    },
  });

  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'CONSULTER_DOCUMENT_PROJET',
    data: {
      documentKey: abandon.demande.confirmation?.réponseSignée.formatter() || '',
    },
  });

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
    },
  });
};
