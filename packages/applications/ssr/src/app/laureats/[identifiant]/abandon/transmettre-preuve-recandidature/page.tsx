import { redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

type PageProps = IdentifiantParameter;

/**
 * @deprecated
 * Cette Page est conservée pour la retrocompatibilité avec les mails préalablement envoyés,
 * et redirige vers le détail de l'abandon où il y a un bouton d'action avec une modale pour transmettre
 */
export default async function Page({ params: { identifiant } }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return redirect(Routes.Abandon.détail(identifiantProjet));
}
