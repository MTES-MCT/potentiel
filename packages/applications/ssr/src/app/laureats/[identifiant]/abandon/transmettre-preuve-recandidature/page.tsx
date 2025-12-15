import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

import { getAbandonInfos } from '../../_helpers/getLauréat';

type PageProps = IdentifiantParameter;

/**
 * @deprecated
 * Cette Page est conservée pour la retrocompatibilité avec les mails préalablement envoyés,
 * et redirige vers le détail de l'abandon où il y a un bouton d'action avec une modale pour transmettre
 */
export default async function Page({ params: { identifiant } }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandonInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );
  if (!abandon) {
    return notFound();
  }
  return redirect(Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()));
}
