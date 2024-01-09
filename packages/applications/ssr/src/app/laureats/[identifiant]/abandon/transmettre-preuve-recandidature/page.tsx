export const dynamic = 'force-dynamic';

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
} from '@/components/pages/abandon/transmettrePreuveRecandidature/TransmettrePreuveRecandidaturePage';
import { decodeParameter } from '@/utils/decodeParameter';
import { Abandon } from '@potentiel-domain/laureat';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transmettre preuve de recandidature - Potentiel',
  description: 'Formulaire de transmission de preuve de recandidature suite à un abandon',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const utilisateur = await getUser();

    if (!utilisateur) {
      redirect('/login.html');
    }

    // TODO : Rendre cette vérification automatiquement lors de l'exécution
    //        d'un(e) query/usecase avec un identifiantProjet
    if (utilisateur.rôle === 'porteur-projet') {
      await mediator.send<VérifierAccèsProjetQuery>({
        type: 'VERIFIER_ACCES_PROJET_QUERY',
        data: {
          identifiantProjet,
          identifiantUtilisateur: utilisateur.email,
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
      redirect(`/laureats/${identifiant}/abandon/transmettre-preuve-recandidature`);
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
      identifiantUtilisateur: utilisateur.email,
    };

    return (
      <TransmettrePreuveRecandidaturePage {...{ ...transmettrePreuveRecandidaturePageProps }} />
    );
  });
}
