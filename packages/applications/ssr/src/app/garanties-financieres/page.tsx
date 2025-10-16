import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

export default async function Page() {
  return redirect(Routes.GarantiesFinancières.dépôt.lister());
}
