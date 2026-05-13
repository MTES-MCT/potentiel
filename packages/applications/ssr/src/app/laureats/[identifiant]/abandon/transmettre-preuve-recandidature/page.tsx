import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { redirectAvecSearchParams, PageDeRedirectionProps } from '@/utils/redirectAvecSearchParams';

import { getAbandonInfos } from '../../_helpers/getLauréat';

/**
 * @deprecated
 * Cette Page est conservée pour la retrocompatibilité avec les mails préalablement envoyés,
 * et redirige vers le détail de l'abandon où il y a un bouton d'action avec une modale pour transmettre
 */
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandonInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );
  if (!abandon) {
    return notFound();
  }
  return redirectAvecSearchParams(
    Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()),
    searchParams,
  );
}
