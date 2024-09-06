import { buildTestDocument } from '@potentiel-applications/document-builder';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';

export const GET = async () =>
  withUtilisateur(async (utilisateur) => {
    const rôleUtilisateur = utilisateur.role;

    const canPreviewAttestation = rôleUtilisateur.aLaPermission(
      'candidature.attestation.prévisualiser',
    );

    if (!canPreviewAttestation) {
      throw new AccèsFonctionnalitéRefuséError(
        'candidature.attestation.prévisualiser',
        rôleUtilisateur.nom,
      );
    }

    const content = await buildTestDocument();

    return new Response(content, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'inline',
      },
    });
  });
