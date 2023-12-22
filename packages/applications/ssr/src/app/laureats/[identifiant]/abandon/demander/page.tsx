import { Message, MessageHandler, mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/demander/DemanderAbandonPage';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';
import { NotFoundError } from '@potentiel-domain/core';
import { Metadata } from 'next';
import { Routes } from '@potentiel-libraries/routes';

export const metadata: Metadata = {
  title: "Demander l'abandon du projet - Potentiel",
  description: "Formulaire d'abandon",
};
import { cookies } from 'next/headers';

type GetAccessTokenMessage = Message<'GET_ACCESS_TOKEN', {}, string>;

const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token' } = process.env;

const handler: MessageHandler<GetAccessTokenMessage> = async () => {
  const cookiesContent = cookies();
  return cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value || '';
};

mediator.register('GET_ACCESS_TOKEN', handler);

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

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: {
        identifiantProjet,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'CONSULTER_APPEL_OFFRE_QUERY',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
        data: {
          identifiantProjet,
        },
      });

    if (appelOffres.choisirNouveauCahierDesCharges && cahierDesChargesChoisi === 'initial') {
      redirect(Routes.Projet.details(identifiantProjet));
    }

    const période = appelOffres.periodes.find((p) => p.id === candidature.période);
    if (!période) {
      throw new NotFoundError('Période de notification introuvable');
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      identifiantUtilisateur: utilisateur.email,
      projet: { ...candidature, identifiantProjet },
      showRecandidatureCheckBox: période.abandonAvecRecandidature ? true : false,
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
