import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return redirect(Routes.Abandon.détail(identifiantProjet));
}
