import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getAbandonInfos } from '../_helpers/getLauréat';

type ProjetPageProps = IdentifiantParameter;

// Page de redirection vers l'abandon en cours du projet
export default async function ProjetPage({ params: { identifiant } }: ProjetPageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandonInfos({ identifiantProjet });
  if (!abandon) {
    return notFound();
  }

  return redirect(Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()));
}
