import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import {
  type PageDeRedirectionProps,
  redirectAvecSearchParams,
} from '@/utils/redirectAvecSearchParams';
import { getAbandon } from '../_helpers/getLauréat';

// Page de redirection vers la dernière d'abandon du projet
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);
  const abandon = await getAbandon(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  return redirectAvecSearchParams(
    Routes.Abandon.détail(identifiantProjet, abandon.demandéLe.formatter()),
    searchParams,
  );
}
