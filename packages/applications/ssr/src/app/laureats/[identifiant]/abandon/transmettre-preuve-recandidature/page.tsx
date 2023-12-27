import { mediator } from 'mediateur';
import {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
} from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { redirect } from 'next/navigation';
import {
  TransmettrePreuveRecandidaturePage,
  TransmettrePreuveRecandidaturePageProps,
} from '@/components/pages/abandon/transmettrePreuveRecandidature/TransmettrePreuveRecandidaturePage';
import { decodeParameter } from '@/utils/decodeParameter';
import { Abandon } from '@potentiel-domain/laureat';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import type { Metadata } from 'next';
import { Routes } from '@potentiel-libraries/routes';

export const metadata: Metadata = {
  title: 'Transmettre preuve de recandidature - Potentiel',
  description: 'Formulaire de transmission de preuve de recandidature suite à un abandon',
};
import { Role, Utilisateur, VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { GetAccessTokenMessage } from '@/bootstrap/getAccessToken.handler';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const accessToken = await mediator.send<GetAccessTokenMessage>({
      type: 'GET_ACCESS_TOKEN',
      data: {},
    });
    const utilisateur = Utilisateur.convertirEnValueType(accessToken);

    // TODO : Rendre cette vérification automatiquement lors de l'exécution
    //        d'un(e) query/usecase avec un identifiantProjet
    if (utilisateur.role.estÉgaleÀ(Role.porteur)) {
      await mediator.send<VérifierAccèsProjetQuery>({
        type: 'VERIFIER_ACCES_PROJET_QUERY',
        data: {
          identifiantProjet,
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
        },
      });
    }

    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON_QUERY',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const preuveDéjàTransmise = !!abandon.demande.preuveRecandidature;

    if (preuveDéjàTransmise) {
      redirect(Routes.Abandon.transmettrePreuveRecandidature(identifiantProjet));
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
          identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
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
      identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
    };

    return (
      <TransmettrePreuveRecandidaturePage {...{ ...transmettrePreuveRecandidaturePageProps }} />
    );
  });
}
