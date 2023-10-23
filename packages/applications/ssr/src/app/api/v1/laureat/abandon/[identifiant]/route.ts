import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { executeAction } from '@/utils/executeAction';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { Abandon } from '@potentiel-domain/laureat';

bootstrap();

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) =>
  executeAction(async () => {
    const result = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON',
      data: {
        identifiantProjetValue: identifiant,
      },
    });

    return Response.json(result);
  });
