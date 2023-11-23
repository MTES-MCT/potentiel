import { mediator } from 'mediateur';
import {
  ConsulterCandidatureQuery,
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery,
} from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from '@/components/pages/abandon/transmettre-preuve-recandidature/TransmettrePreuveRecandidaturePage';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const utilisateur = await getUser();
  if (!utilisateur) {
    redirect('/login.html');
  }

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE_QUERY',
    data: {
      identifiantProjet,
    },
  });

  const projetsÀSélectionner =
    await mediator.send<ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery>({
      type: 'LISTER_CANDIDATURES_NOTIFIÉES_ET_NON_ABANDONNÉES_PAR_PORTEUR_QUERY',
      data: {
        identifiantUtilisateur: utilisateur.email,
      },
    });

  const transmettrePreuveRecandidaturePageProps: TransmettrePreuveRecandidaturePageProps = {
    projet: {
      ...candidature,
      identifiantProjet,
    },
    projetsÀSélectionner: projetsÀSélectionner.map((projet) => ({
      ...projet,
      statut: projet.statut.statut,
      identifiantProjet: projet.identifiantProjet.formatter(),
    })),
    utilisateur,
  };

  return <TransmettrePreuveRecandidaturePage {...{ ...transmettrePreuveRecandidaturePageProps }} />;
}
