import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  DetailAbandonPage,
  DetailAbandonPageProps,
} from '@/components/pages/abandon/DetailAbandonPage';
import { getUser } from '@/utils/getUser';

export default async function DetailsAbandonPage({
  params: { identifiant },
}: IdentifiantParameter) {
  const identifiantProjet = decodeURIComponent(identifiant);

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE',
    data: {
      identifiantProjet,
    },
  });

  const { statut, demande, accord, rejet } = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON_QUERY',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const utilisateur = await getUser();

  if (!utilisateur) {
    // TODO : rediriger sur la page d'accueil
    return;
  }

  const detailAbandonPageProps: DetailAbandonPageProps = {
    utilisateur: { rôle: utilisateur.role.nom },
    identifiantProjet,
    candidature,
    statut: statut.statut,
    demande: {
      demandéPar: demande.demandéPar.formatter(),
      demandéLe: demande.demandéLe.formatter(),
      recandidature: demande.recandidature,
      raison: demande.raison,
      ...(demande.piéceJustificative && {
        pièceJustificative: demande.piéceJustificative.formatter(),
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
}
