import type { Metadata } from 'next';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ExportProjetPage } from './exportProjet.page';

export const metadata: Metadata = {
  title: 'Export de projet - Potentiel',
  description: `Page d'export des projets au format CSV`,
};

export default async function Page() {
  return PageWithErrorHandling(async () => <ExportProjetPage />);
}
