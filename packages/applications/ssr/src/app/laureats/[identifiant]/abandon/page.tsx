import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Role, Utilisateur, VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';

import {
  DetailAbandonPage,
  DetailAbandonPageProps,
} from '@/components/pages/abandon/détails/DetailAbandonPage';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

type PageProps = IdentifiantParameter;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE_QUERY',
    data: {
      identifiantProjet: decodeParameter(params.identifiant),
    },
  });

  return {
    title: `Abandon du projet ${candidature.nom} - Potentiel`,
  };
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

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

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: {
          identifiantProjet,
        },
      });

      const { statut, demande, accord, rejet } = await mediator.send<Abandon.ConsulterAbandonQuery>(
        {
          type: 'CONSULTER_ABANDON_QUERY',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        },
      );

      // TODO: extract the logic in a dedicated function mapToProps
      // identifiantProjet must come from the readmodel as a value type
      const detailAbandonPageProps: DetailAbandonPageProps = {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
        projet: { ...candidature, identifiantProjet },
        statut: statut.statut,
        abandon: {
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

        actions: mapToActions({ utilisateur, recandidature: demande.recandidature, statut }),
      };

      return <DetailAbandonPage {...{ ...detailAbandonPageProps }} />;
    }),
  );
}

// TODO: this should be a query with the identifiantUtilisateur and identifiantProjet
type AvailableActions = DetailAbandonPageProps['actions'];
const mapToActions = ({
  utilisateur,
  recandidature,
  statut,
}: {
  utilisateur: Utilisateur.ValueType;
  recandidature: boolean;
  statut: Abandon.StatutAbandon.ValueType;
}): AvailableActions => {
  const actions: AvailableActions = [];
  const demandeConfirmationPossible = statut.estDemandé() && !recandidature;

  switch (utilisateur.role.nom) {
    case 'admin':
      if (demandeConfirmationPossible) {
        actions.push('demander-confirmation');
      }
      if (statut.estEnCours() && !recandidature) {
        actions.push('accorder-sans-recandidature');
        actions.push('rejeter');
      }
      break;

    case 'dgec-validateur':
      if (demandeConfirmationPossible) {
        actions.push('demander-confirmation');
      }
      if (statut.estEnCours()) {
        actions.push(recandidature ? 'accorder-avec-recandidature' : 'accorder-sans-recandidature');
        actions.push('rejeter');
      }
      break;

    case 'porteur-projet':
      if (statut.estConfirmationDemandée()) {
        actions.push('confirmer');
      }
      if (statut.estEnCours()) {
        actions.push('annuler');
      }
      break;
  }

  return actions;
};
