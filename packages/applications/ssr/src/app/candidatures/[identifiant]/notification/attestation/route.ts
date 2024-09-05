import { buildTestDocument } from '@potentiel-applications/document-builder';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    console.log(identifiantProjet);
    console.log(utilisateur);

    const content = await buildTestDocument();

    return new Response(content, {
      headers: {
        'content-type': 'application/pdf',
      },
    });
  });
