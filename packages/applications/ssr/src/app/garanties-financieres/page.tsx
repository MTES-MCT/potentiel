import { notFound, redirect } from 'next/navigation';

import { featureFlags } from '@potentiel-applications/feature-flags';
import { Routes } from '@potentiel-libraries/routes';

export default async function Page() {
  if (featureFlags.SHOW_GARANTIES_FINANCIERES) {
    return redirect(Routes.GarantiesFinancières.dépôt.lister);
  }

  return notFound();
}
