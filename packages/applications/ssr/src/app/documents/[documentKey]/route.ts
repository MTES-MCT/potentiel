import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { apiAction } from '@/utils/apiAction';

type DocumentKeyParameter = {
  params: {
    documentKey: string;
  };
};

export const GET = (_: Request, { params: { documentKey } }: DocumentKeyParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const [identifiantProjet] = documentKey.split('/');

      await mediator.send<VérifierAccèsProjetQuery>({
        type: 'System.Authorization.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: decodeURIComponent(identifiantProjet),
          utilisateur,
        },
      });
      const result = await mediator.send<ConsulterDocumentProjetQuery>({
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
