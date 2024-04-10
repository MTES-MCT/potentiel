import { notFound, redirect } from 'next/navigation';

import { featureFlags } from '@potentiel-applications/feature-flags';
import { Routes } from '@potentiel-applications/routes';

export default async function Page() {
  if (!featureFlags.SHOW_GARANTIES_FINANCIERES) {
    return notFound();
  }

  return redirect(Routes.GarantiesFinancières.dépôt.lister);
}
