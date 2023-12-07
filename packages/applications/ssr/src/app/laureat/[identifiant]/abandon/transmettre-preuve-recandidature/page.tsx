import { mediator } from 'mediateur';
import {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
} from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from '@/components/pages/abandon/transmettre-preuve-recandidature/TransmettrePreuveRecandidaturePage';
import { decodeParameter } from '@/utils/decodeParameter';
import { Abandon } from '@potentiel-domain/laureat';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getAccessToken } from '@/utils/getAccessToken';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const utilisateur = await getUser();

    if (!utilisateur) {
      redirect('/login.html');
    }

    try {
      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'CONSULTER_ABANDON_QUERY',
        data: {
          identifiantProjetValue: identifiantProjet,
          utilisateurValue: await getAccessToken(),
        },
      });

      const preuveDéjàTransmise = !!abandon.demande.preuveRecandidature;

      if (preuveDéjàTransmise) {
        redirect(`/laureat/${identifiant}/abandon/transmettre-preuve-recandidature`);
      }

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: {
          identifiantProjet,
        },
      });

      const projetsÀSélectionner =
        await mediator.send<ListerCandidaturesEligiblesPreuveRecanditureQuery>({
          type: 'LISTER_CANDIDATURES_ELIGIBLES_PREUVE_RECANDIDATURE_QUERY',
          data: {
            identifiantUtilisateur: utilisateur.email,
          },
        });

      const transmettrePreuveRecandidaturePageProps: TransmettrePreuveRecandidaturePageProps = {
        projet: {
          ...candidature,
          identifiantProjet,
        },
        projetsÀSélectionner: projetsÀSélectionner
          .filter((p) => p.identifiantProjet.formatter() !== identifiantProjet)
          .map((projet) => ({
            ...projet,
            statut: projet.statut.statut,
            identifiantProjet: projet.identifiantProjet.formatter(),
          })),
      };

      return (
        <TransmettrePreuveRecandidaturePage {...{ ...transmettrePreuveRecandidaturePageProps }} />
      );
    } catch (e) {
      redirect('/404');
    }
  });
}
