import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import {
  type PageDeRedirectionProps,
  redirectAvecSearchParams,
} from '@/utils/redirectAvecSearchParams';
import { getAbandonInfos } from '../_helpers/getLauréat';

// Page de redirection vers la dernière d'abandon du projet
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
