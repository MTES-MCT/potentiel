import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Abandon } from '@potentiel-domain/laureat';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import {
  DétailsAbandonPage,
  DétailsAbandonPageProps,
} from '@/components/pages/abandon/détails/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

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

      const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      return (
        <DétailsAbandonPage
          abandon={mapToPlainObject(abandon)}
          identifiantProjet={identifiantProjet}
          role={mapToPlainObject(utilisateur.role)}
          actions={mapToActions({
            utilisateur,
            recandidature: abandon.demande.estUneRecandidature,
            statut: abandon.statut,
          })}
        />
      );
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
      if (statut.estAccordé()) {
        actions.push('demander-mainlevée');
      }
      if (recandidature) break;
  }

  return actions;
};
