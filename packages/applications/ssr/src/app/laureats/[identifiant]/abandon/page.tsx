import { mediator } from 'mediateur';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { Email } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  DétailsAbandonPage,
  DétailsAbandonPageProps,
} from '@/components/pages/abandon/détails/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToAbandonTimelineItemProps } from '@/utils/historique/mapToProps/abandon/mapToAbandonTimelineItemProps';

type PageProps = IdentifiantParameter;

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
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
  } catch {
    return {};
  }
}

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      const historique = await mediator.send<Lauréat.Abandon.ListerHistoriqueAbandonProjetQuery>({
        type: 'Lauréat.Abandon.Query.ListerHistoriqueAbandonProjet',
        data: {
          identifiantProjet,
        },
      });

      const actions = mapToActions({
        utilisateur,
        statutRecandidature: abandon.demande.recandidature?.statut,
        statut: abandon.statut,
        passéEnInstructionPar: abandon.demande.instruction?.passéEnInstructionPar,
      });

      return (
        <DétailsAbandonPage
          abandon={mapToPlainObject(abandon)}
          identifiantProjet={identifiantProjet}
          actions={actions}
          informations={mapToInformations({
            utilisateur,
            recandidature: abandon.demande.estUneRecandidature,
            statut: abandon.statut,
          })}
          historique={historique.items.map(mapToAbandonTimelineItemProps)}
        />
      );
    }),
  );
}

// TODO: this should be a query with the identifiantUtilisateur and identifiantProjet
type AvailableActions = DétailsAbandonPageProps['actions'];

type MapToActionsProps = {
  utilisateur: Utilisateur.ValueType;
  statutRecandidature: Lauréat.Abandon.StatutPreuveRecandidature.ValueType | undefined;
  statut: Lauréat.Abandon.StatutAbandon.ValueType;
  passéEnInstructionPar?: Email.ValueType;
};

const mapToActions = ({
  utilisateur,
  statutRecandidature,
  statut,
  passéEnInstructionPar,
}: MapToActionsProps): AvailableActions => {
  const actions: AvailableActions = [];

  switch (utilisateur.role.nom) {
    case 'admin':
      if (statutRecandidature) {
        break;
      }
      if (changementPossible(statut, 'confirmation-demandée')) {
        actions.push('demander-confirmation');
      }
      if (changementPossible(statut, 'accordé')) {
        actions.push('accorder-sans-recandidature');
      }
      if (changementPossible(statut, 'rejeté')) {
        actions.push('rejeter');
      }
      if (changementPossible(statut, 'en-instruction')) {
        if (statut.estEnInstruction()) {
          if (
            passéEnInstructionPar &&
            !utilisateur.identifiantUtilisateur.estÉgaleÀ(passéEnInstructionPar)
          ) {
            actions.push('reprendre-instruction');
          }
        } else {
          actions.push('passer-en-instruction');
        }
      }
      break;

    case 'dgec-validateur':
      if (changementPossible(statut, 'confirmation-demandée')) {
        actions.push('demander-confirmation');
      }
      if (changementPossible(statut, 'accordé')) {
        actions.push(
          statutRecandidature ? 'accorder-avec-recandidature' : 'accorder-sans-recandidature',
        );
      }
      if (changementPossible(statut, 'rejeté')) {
        actions.push('rejeter');
      }
      if (changementPossible(statut, 'en-instruction')) {
        if (statut.estEnInstruction()) {
          if (
            passéEnInstructionPar &&
            !utilisateur.identifiantUtilisateur.estÉgaleÀ(passéEnInstructionPar)
          ) {
            actions.push('reprendre-instruction');
          }
        } else {
          actions.push('passer-en-instruction');
        }
      }
      break;

    case 'porteur-projet':
      if (changementPossible(statut, 'confirmé')) {
        actions.push('confirmer');
      }
      if (changementPossible(statut, 'annulé')) {
        actions.push('annuler');
      }

      if (statut.estAccordé() && statutRecandidature?.estEnAttente()) {
        actions.push('transmettre-preuve-recandidature');
      }
      break;
  }

  return actions;
};

const changementPossible = (
  statutActuel: Lauréat.Abandon.StatutAbandon.ValueType,
  nouveauStatut: Lauréat.Abandon.StatutAbandon.RawType,
) => {
  try {
    statutActuel.vérifierQueLeChangementDeStatutEstPossibleEn(
      Lauréat.Abandon.StatutAbandon.convertirEnValueType(nouveauStatut),
    );
    return true;
  } catch {
    return false;
  }
};

type AvailableInformations = DétailsAbandonPageProps['informations'];

type MapToInformationsProps = {
  utilisateur: Utilisateur.ValueType;
  recandidature: boolean;
  statut: Lauréat.Abandon.StatutAbandon.ValueType;
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
