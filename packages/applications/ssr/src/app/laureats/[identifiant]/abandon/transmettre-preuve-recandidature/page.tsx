import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { IdentifiantParameter } from '@/utils/identifiantParameter';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return redirect(Routes.Abandon.détail(identifiant));
}
