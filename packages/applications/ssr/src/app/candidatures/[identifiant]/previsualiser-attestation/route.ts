import { buildTestDocument } from '@potentiel-applications/document-builder';

import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async () =>
  withUtilisateur(async () => {
    const content = await buildTestDocument();

    return new Response(content, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'inline',
      },
    });
  });
