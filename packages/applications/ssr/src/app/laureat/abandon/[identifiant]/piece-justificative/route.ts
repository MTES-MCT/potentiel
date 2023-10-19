import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { ConsulterPièceJustificativeAbandonProjetQuery } from '@potentiel-domain/laureat';

bootstrap();

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const result = await mediator.send<ConsulterPièceJustificativeAbandonProjetQuery>({
    type: 'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
    data: {
      identifiantProjet: identifiant,
    },
  });

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
    },
  });
};
