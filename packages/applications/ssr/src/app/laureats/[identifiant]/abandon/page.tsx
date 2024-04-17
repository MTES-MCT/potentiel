import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

import {
  DétailsAbandonPage,
  DétailsAbandonPageProps,
} from '@/components/pages/abandon/détails/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { displayDate } from '@/utils/displayDate';

type PageProps = IdentifiantParameter;

/**
 *
 * @todo afficher le nom du projet dans le title de la page
 */
export const metadata: Metadata = {
  title: 'Détail abandon projet - Potentiel',
  description: "Détail de l'abandon d'un projet",
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet,
        },
      });

      const { statut, demande, accord, rejet } = await mediator.send<Abandon.ConsulterAbandonQuery>(
        {
          type: 'Lauréat.Abandon.Query.ConsulterAbandon',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        },
      );

      // TODO: extract the logic in a dedicated function mapToProps
      // identifiantProjet must come from the readmodel as a value type
      const detailAbandonPageProps: DétailsAbandonPageProps = {
        projet: {
          ...candidature,
          dateDésignation: displayDate(candidature.dateDésignation),
          identifiantProjet,
        },
        statut: statut.statut,
        abandon: {
          demande: {
            demandéPar: demande.demandéPar.formatter(),
            demandéLe: displayDate(demande.demandéLe.formatter()),
            recandidature: demande.recandidature,
            lienRecandidature:
              utilisateur.role.estÉgaleÀ(Role.porteur) && demande.recandidature
                ? Routes.Abandon.transmettrePreuveRecandidature(identifiantProjet)
                : undefined,
            raison: demande.raison,
            ...(demande.piéceJustificative && {
              pièceJustificative: demande.piéceJustificative.formatter(),
            }),
            ...(demande.preuveRecandidature && {
              preuveRecandidature: demande.preuveRecandidature.formatter(),
              ...(demande.preuveRecandidatureTransmiseLe && {
                preuveRecandidatureTransmiseLe: displayDate(
                  demande.preuveRecandidatureTransmiseLe.formatter(),
                ),
              }),
              ...(demande.preuveRecandidatureTransmisePar && {
                preuveRecandidatureTransmisePar:
                  demande.preuveRecandidatureTransmisePar.formatter(),
              }),
            }),
            preuveRecandidatureStatut: demande.preuveRecandidatureStatut.statut,
          },
          ...(demande.confirmation && {
            confirmation: {
              demandéLe: displayDate(demande.confirmation.demandéLe.formatter()),
              demandéPar: demande.confirmation.demandéPar.formatter(),
              réponseSignée: demande.confirmation.réponseSignée.formatter(),
              confirméLe: demande.confirmation.confirméLe
                ? displayDate(demande.confirmation.confirméLe.formatter())
                : undefined,
              confirméPar: demande.confirmation.confirméPar?.formatter(),
            },
          }),
          ...(accord && {
            accord: {
              accordéPar: accord.accordéPar.formatter(),
              accordéLe: displayDate(accord.accordéLe.formatter()),
              réponseSignée: accord.réponseSignée.formatter(),
            },
          }),
          ...(rejet && {
            rejet: {
              rejetéLe: displayDate(rejet.rejetéLe.formatter()),
              rejetéPar: rejet.rejetéPar.formatter(),
              réponseSignée: rejet.réponseSignée.formatter(),
            },
          }),
        },

        actions: mapToActions({
          utilisateur,
          recandidature: demande.recandidature,
          statut,
        }),
      };

      return <DétailsAbandonPage {...{ ...detailAbandonPageProps }} />;
    }),
  );
}

// TODO: this should be a query with the identifiantUtilisateur and identifiantProjet
type AvailableActions = DétailsAbandonPageProps['actions'];

type MapToActionsProps = {
  utilisateur: Utilisateur.ValueType;
  recandidature: boolean;
  statut: Abandon.StatutAbandon.ValueType;
};

const mapToActions = ({
  utilisateur,
  recandidature,
  statut,
}: MapToActionsProps): AvailableActions => {
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
      if (recandidature) break;
  }

  return actions;
};
