import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import {
  type PageDeRedirectionProps,
  redirectAvecSearchParams,
} from '@/utils/redirectAvecSearchParams';
import { getAbandon } from '../../_helpers/getLauréat';

/**
 * @deprecated
 * Cette Page est conservée pour la retrocompatibilité avec les mails préalablement envoyés,
 * et redirige vers le détail de l'abandon où il y a un bouton d'action avec une modale pour transmettre
 */
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandon(identifiantProjet);
  return redirectAvecSearchParams(
    Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()),
    searchParams,
  );
}
