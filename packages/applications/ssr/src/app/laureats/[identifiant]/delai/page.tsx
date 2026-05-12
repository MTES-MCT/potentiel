import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getDateDernièreDemandeDélai } from '../_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

type ProjetPageProps = IdentifiantParameter;

// Page de redirection vers la dernière demande de délai du projet
export default async function DélaiPage(props: ProjetPageProps) {
  return withUtilisateur(async (utilisateur) => {
    const params = await props.params;

    const { identifiant } = params;

    const identifiantProjet = decodeParameter(identifiant);

    const dernièreDemandeDélai = await getDateDernièreDemandeDélai({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      emailUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
    });

    if (!dernièreDemandeDélai) {
      return notFound();
    }

    return redirect(Routes.Délai.détail(identifiantProjet, dernièreDemandeDélai));
  });
}
