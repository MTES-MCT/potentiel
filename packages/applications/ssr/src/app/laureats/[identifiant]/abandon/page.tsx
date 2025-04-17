import { mediator } from 'mediateur';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { Abandon } from '@potentiel-domain/laureat';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

import {
  DétailsAbandonPage,
  DétailsAbandonPageProps,
} from '@/components/pages/abandon/détails/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { AbandonHistoryRecord } from '@/components/molecules/historique/timeline/abandon';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);

  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(lauréat)) {
    return notFound();
  }

  return {
    title: `Détail abandon du projet ${lauréat.nomProjet} - Potentiel`,
    description: "Détail de l'abandon d'un projet",
  };
}

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

      const historique = await mediator.send<
        Historique.ListerHistoriqueProjetQuery<AbandonHistoryRecord>
      >({
        type: 'Historique.Query.ListerHistoriqueProjet',
        data: {
          identifiantProjet,
          category: 'abandon',
        },
      });

      let projetsÀSélectionner: DétailsAbandonPageProps['projetsÀSélectionner'] = [];
      const transmissionPreuveRecandidaturePossible = !!(
        utilisateur.role.estÉgaleÀ(Role.porteur) &&
        abandon.demande.accord &&
        abandon.demande.estUneRecandidature &&
        abandon.demande.recandidature?.statut.estÉgaleÀ(Abandon.StatutPreuveRecandidature.enAttente)
      );

      if (transmissionPreuveRecandidaturePossible) {
        const projetsEligiblesPreuveRecandidature =
          await mediator.send<Candidature.ListerProjetsEligiblesPreuveRecanditureQuery>({
            type: 'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
            data: {
              identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
            },
          });

        projetsÀSélectionner = projetsEligiblesPreuveRecandidature
          .filter((p) => p.identifiantProjet.formatter() !== identifiantProjet)
          .map((projet) => ({
            ...projet,
            statut: projet.statut.statut,
            identifiantProjet: projet.identifiantProjet.formatter(),
          }));
      }

      return (
        <DétailsAbandonPage
          abandon={mapToPlainObject(abandon)}
          identifiantProjet={identifiantProjet}
          actions={mapToActions({
            utilisateur,
            recandidature: abandon.demande.estUneRecandidature,
            statut: abandon.statut,
            transmissionPreuveRecandidaturePossible,
          })}
          informations={mapToInformations({
            utilisateur,
            recandidature: abandon.demande.estUneRecandidature,
            statut: abandon.statut,
          })}
          projetsÀSélectionner={projetsÀSélectionner}
          historique={mapToPlainObject(historique)}
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
  transmissionPreuveRecandidaturePossible: boolean;
  statut: Abandon.StatutAbandon.ValueType;
};

const mapToActions = ({
  utilisateur,
  recandidature,
  statut,
  transmissionPreuveRecandidaturePossible,
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
        if (statut.estEnInstruction()) {
          actions.push('reprendre-instruction');
        } else {
          actions.push('passer-en-instruction');
        }
      }
      break;

    case 'dgec-validateur':
      if (demandeConfirmationPossible) {
        actions.push('demander-confirmation');
      }
      if (statut.estEnCours()) {
        actions.push(recandidature ? 'accorder-avec-recandidature' : 'accorder-sans-recandidature');
        actions.push('rejeter');
        if (statut.estEnInstruction()) {
          actions.push('reprendre-instruction');
        } else {
          actions.push('passer-en-instruction');
        }
      }
      break;

    case 'porteur-projet':
      if (statut.estConfirmationDemandée()) {
        actions.push('confirmer');
      }

      if (statut.estEnCours() && !statut.estConfirmé()) {
        actions.push('annuler');
      }

      if (transmissionPreuveRecandidaturePossible) {
        actions.push('transmettre-preuve-recandidature');
      }
      break;
  }

  return actions;
};

type AvailableInformations = DétailsAbandonPageProps['informations'];

type MapToInformationsProps = {
  utilisateur: Utilisateur.ValueType;
  recandidature: boolean;
  statut: Abandon.StatutAbandon.ValueType;
};

const mapToInformations = ({ statut, utilisateur, recandidature }: MapToInformationsProps) => {
  const informations: AvailableInformations = [];

  if (utilisateur.role.estÉgaleÀ(Role.porteur) && statut.estAccordé()) {
    informations.push('demande-de-mainlevée');
  }

  if (recandidature) {
    informations.push('demande-abandon-pour-recandidature');
  }

  return informations;
};
