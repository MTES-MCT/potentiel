import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageDeRedirectionProps, redirectAvecSearchParams } from '@/utils/redirectAvecSearchParams';

import { getPuissanceInfos } from '../../../_helpers';

// Page de redirection vers la dernière demande de changement de puissance du projet
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);

  const puissance = await getPuissanceInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  if (!puissance.dateDernièreDemande) {
    return notFound();
  }

  return redirectAvecSearchParams(
    Routes.Puissance.changement.détails(
      identifiantProjet,
      puissance.dateDernièreDemande.formatter(),
    ),
    searchParams,
  );
}
