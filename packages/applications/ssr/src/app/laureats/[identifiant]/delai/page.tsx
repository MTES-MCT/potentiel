import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { redirectAvecSearchParams, PageDeRedirectionProps } from '@/utils/redirectAvecSearchParams';

import { getDateDernièreDemandeDélai } from '../_helpers/getDélai';

// Page de redirection vers la dernière demande de délai du projet
export default async function DélaiPage(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    const dernièreDemandeDélai = await getDateDernièreDemandeDélai({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      emailUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
    });

    if (!dernièreDemandeDélai) {
      return notFound();
    }

    return redirectAvecSearchParams(
      Routes.Délai.détail(identifiantProjet, dernièreDemandeDélai),
      searchParams,
    );
  });
}
