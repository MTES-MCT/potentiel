import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import {
  type PageDeRedirectionProps,
  redirectAvecSearchParams,
} from '@/utils/redirectAvecSearchParams';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getDateDernièreDemandeDélai } from '../../_helpers/getDélai';

// Page de redirection vers la dernière demande de délai du projet
export default async function DélaiPage(
  props: PageDeRedirectionProps & { params: Promise<{ motif: string }> },
) {
  const { identifiant, motif } = await props.params;
  const searchParams = await props.searchParams;

  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    const motifDemande =
      motif === 'achevement'
        ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement
        : Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai;

    const dernièreDemandeDélai = await getDateDernièreDemandeDélai({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      emailUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      motif: motifDemande.formatter(),
    });

    if (!dernièreDemandeDélai) {
      return notFound();
    }

    return redirectAvecSearchParams(
      Routes.Délai.détail({
        identifiantProjet,
        date: dernièreDemandeDélai,
        motif: motifDemande.formatter(),
      }),
      searchParams,
    );
  });
}
