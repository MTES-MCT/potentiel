import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getAbandonInfos } from '../_helpers/getLauréat';

type ProjetPageProps = IdentifiantParameter;

// Page de redirection vers l'abandon en cours du projet
export default async function ProjetPage({ params: { identifiant } }: ProjetPageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandonInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );
  if (!abandon) {
    return notFound();
  }

  return redirect(Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()));
}
