import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import type { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import type { Accès } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

type DocumentKeyParameter = {
  params: {
    documentKey: string;
  };
};

export const GET = (_: Request, { params: { documentKey } }: DocumentKeyParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const [identifiantProjet] = documentKey.split('/');

      await mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: decodeURIComponent(identifiantProjet),
          identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
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
