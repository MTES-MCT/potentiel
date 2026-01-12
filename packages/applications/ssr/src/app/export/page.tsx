import type { Metadata } from 'next';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { ExportPage } from './export.page';

export const metadata: Metadata = {
  title: 'Export de données - Potentiel',
  description: `Page d'export des données au format CSV`,
};

export default async function Page() {
  return PageWithErrorHandling(async () => <ExportPage />);
}
