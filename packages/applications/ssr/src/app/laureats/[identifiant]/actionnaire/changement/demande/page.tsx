import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { redirectAvecSearchParams, PageDeRedirectionProps } from '@/utils/redirectAvecSearchParams';

import { getActionnaireInfos } from '../../../_helpers';

// Page de redirection vers la dernière demande de changement d'actionnaire du projet
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);

  const actionnaire = await getActionnaireInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  if (!actionnaire.dateDernièreDemande) {
    return notFound();
  }

  return redirectAvecSearchParams(
    Routes.Actionnaire.changement.détails(
      identifiantProjet,
      actionnaire.dateDernièreDemande.formatter(),
    ),
    searchParams,
  );
}
