import { mediator } from 'mediateur';

import { bootstrap } from '@/infrastructure/bootstrap';
import { executeAction } from '@/utils/executeAction';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { ConsulterAbandonQuery } from '@potentiel-domain/laureat';

bootstrap();

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) =>
  executeAction(async () => {
    const result = await mediator.send<ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON',
      data: {
        identifiantProjet: identifiant,
      },
    });

    return Response.json(result);
  });
