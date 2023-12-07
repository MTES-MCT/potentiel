import { mediator } from 'mediateur';
import { redirect } from 'next/navigation';
import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

import {
  DetailAbandonPage,
  DetailAbandonPageProps,
} from '@/components/pages/abandon/DetailAbandonPage';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getAccessToken } from '@/utils/getAccessToken';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);
    const utilisateur = await getUser();

    if (!utilisateur) {
      return redirect('/login.html');
    }
    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: {
        identifiantProjet,
      },
    });

    const { statut, demande, accord, rejet } = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'CONSULTER_ABANDON_QUERY',
      data: {
        identifiantProjetValue: identifiantProjet,
        utilisateurValue: await getAccessToken(),
      },
    });

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const detailAbandonPageProps: DetailAbandonPageProps = {
      utilisateur,
      projet: { ...candidature, identifiantProjet },
      statut: statut.statut,
      demande: {
        demandéPar: demande.demandéPar.formatter(),
        demandéLe: demande.demandéLe.formatter(),
        recandidature: demande.recandidature,
        raison: demande.raison,
        ...(demande.piéceJustificative && {
          pièceJustificative: demande.piéceJustificative.formatter(),
        }),
        ...(demande.preuveRecandidature && {
          preuveRecandidature: demande.preuveRecandidature.formatter(),
        }),
      },
      instruction: {
        ...(demande.confirmation && {
          confirmation: {
            demandéLe: demande.confirmation.demandéLe.formatter(),
            demandéPar: demande.confirmation.demandéPar.formatter(),
            réponseSignée: demande.confirmation.réponseSignée.formatter(),
            confirméLe: demande.confirmation.confirméLe?.formatter(),
            confirméPar: demande.confirmation.confirméPar?.formatter(),
          },
        }),
        ...(accord && {
          accord: {
            accordéPar: accord.accordéPar.formatter(),
            accordéLe: accord.accordéLe.formatter(),
            réponseSignée: accord.réponseSignée.formatter(),
          },
        }),
        ...(rejet && {
          rejet: {
            rejetéLe: rejet.rejetéLe.formatter(),
            rejetéPar: rejet.rejetéPar.formatter(),
            réponseSignée: rejet.réponseSignée.formatter(),
          },
        }),
      },
    };

    return <DetailAbandonPage {...{ ...detailAbandonPageProps }} />;
  });
}
