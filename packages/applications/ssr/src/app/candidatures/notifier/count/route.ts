import { mediator } from 'mediateur';
import { z } from 'zod';

import { Candidature } from '@potentiel-domain/candidature';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const querySchema = z.object({
  appelOffre: z.string(),
  periode: z.string(),
});

export const GET = (req: Request) =>
  apiAction(() =>
    withUtilisateur(async () => {
      const parseResult = querySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
      console.log(parseResult);
      if (!parseResult.success) {
        return Response.json(
          {
            errors: parseResult.error.errors.map((error) => ({
              path: error.path[0],
              message: error.message,
            })),
          },
          { status: 400 },
        );
      }
      const { appelOffre } = parseResult.data;
      const result = await mediator.send<Candidature.ListerCandidaturesQuery>({
        type: 'Candidature.Query.ListerCandidatures',
        data: {
          appelOffre,
          // TODO période
        },
      });
      return Response.json({ count: result.total });
    }),
  );
