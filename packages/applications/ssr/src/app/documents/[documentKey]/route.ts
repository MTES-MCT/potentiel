import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Document } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Accès } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';

export const GET = async (_: Request, ctx: RouteContext<'/documents/[documentKey]'>) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const { documentKey } = await ctx.params;
      const [identifiantProjet] = documentKey.split('/');

      await mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: decodeURIComponent(identifiantProjet),
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        },
      });
      const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey,
        },
      });

      if (Option.isNone(result)) {
        return notFound();
      }

      return new Response(result.content, {
        headers: {
          'content-type': result.format,
        },
      });
    }),
  );
