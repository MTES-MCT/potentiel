import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import {
  type PageDeRedirectionProps,
  redirectAvecSearchParams,
} from '@/utils/redirectAvecSearchParams';
import { getReprésentantLégalInfos } from '../../../_helpers';

// Page de redirection vers la dernière demande de changement de RL du projet
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  const identifiantProjet = decodeParameter(identifiant);

  const représentantLégal = await getReprésentantLégalInfos(
    IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
  );

  if (!représentantLégal.dateDernièreDemande) {
    return notFound();
  }

  return redirectAvecSearchParams(
    Routes.ReprésentantLégal.changement.détails(
      identifiantProjet,
      représentantLégal.dateDernièreDemande.formatter(),
    ),
    searchParams,
  );
}
