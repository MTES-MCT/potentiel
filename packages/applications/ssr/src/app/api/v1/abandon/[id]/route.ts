import { bootstrap } from '@/infrastructure/bootstrap';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';
import { ConsulterAbandonQuery } from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';
import { mediator } from 'mediateur';

bootstrap();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id as `${string}#${string}#${string}#${string}`;
  console.log(id);
  const result = await mediator.send<ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON',
    data: {
      identifiantProjet: convertirEnIdentifiantProjet(id),
    },
  });

  console.log();

  if (isSome(result)) {
    return Response.json(result);
  }
}
