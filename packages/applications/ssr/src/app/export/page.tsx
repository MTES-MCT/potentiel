import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { ExportProjetPage } from './exportProjet.page';

export const metadata: Metadata = {
  title: 'Export de projet - Potentiel',
  description: `Page d'export des projets au format CSV`,
};

export default async function Page() {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      if (!utilisateur.rôle.aLaPermission('projet.export.exportRaccordement')) {
        return notFound();
      }

      return <ExportProjetPage />;
    }),
  );
}
