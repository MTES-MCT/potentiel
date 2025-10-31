import { mediator } from 'mediateur';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  DétailsAbandonPage,
  DétailsAbandonPageProps,
} from '@/app/laureats/[identifiant]/abandon/(détails)/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { mapToAbandonTimelineItemProps } from '../(historique)/mapToAbandonTimelineItemProps';

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
        abandon,
      });

      const projetsÀSélectionner = actions.includes('transmettre-preuve-recandidature')
        ? await getProjetsÀSélectionner({
            identifiantProjet: abandon.identifiantProjet,
            utilisateur,
          })
        : [];

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
          projetsÀSélectionner={projetsÀSélectionner}
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
  abandon: Lauréat.Abandon.ConsulterAbandonReadModel;
};

const mapToActions = ({
  utilisateur,
  abandon: { statut, demande },
}: MapToActionsProps): AvailableActions => {
  const actions: AvailableActions = [];
  const statutRecandidature = demande.recandidature?.statut;
  const passéEnInstructionPar = demande.instruction?.passéEnInstructionPar;

  return match(utilisateur.rôle.nom)
    .with(P.union('admin', 'dreal'), () => {
      if (demande.recandidature) return actions;
      if (!demande.autoritéCompétente.estCompétent(utilisateur.rôle)) return actions;

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
      return actions;
    })

    .with('dgec-validateur', () => {
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
      return actions;
    })
    .with('porteur-projet', () => {
      if (changementPossible(statut, 'confirmé')) {
        actions.push('confirmer');
      }
      if (changementPossible(statut, 'annulé')) {
        actions.push('annuler');
      }

      if (statut.estAccordé() && statutRecandidature?.estEnAttente()) {
        actions.push('transmettre-preuve-recandidature');
      }

      return actions;
    })

    .otherwise(() => actions);
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

type GetProjetsÀSelectionnerProps = {
  utilisateur: Utilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

const getProjetsÀSélectionner = async ({
  identifiantProjet,
  utilisateur,
}: GetProjetsÀSelectionnerProps): Promise<DétailsAbandonPageProps['projetsÀSélectionner']> => {
  const projetsEligiblesPreuveRecandidature =
    await mediator.send<Candidature.ListerProjetsEligiblesPreuveRecanditureQuery>({
      type: 'Candidature.Query.ListerProjetsEligiblesPreuveRecandidature',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.email,
      },
    });

  return projetsEligiblesPreuveRecandidature
    .filter((p) => !p.identifiantProjet.estÉgaleÀ(identifiantProjet))
    .map((projet) => ({
      identifiantProjet: projet.identifiantProjet.formatter(),
      nom: projet.nom,
      dateDésignation: projet.dateDésignation.formatter(),
      appelOffre: projet.identifiantProjet.appelOffre,
      période: projet.identifiantProjet.période,
      famille: projet.identifiantProjet.famille,
      numéroCRE: projet.identifiantProjet.numéroCRE,
    }));
};

type AvailableInformations = DétailsAbandonPageProps['informations'];

type MapToInformationsProps = {
  utilisateur: Utilisateur.ValueType;
  recandidature: boolean;
  statut: Lauréat.Abandon.StatutAbandon.ValueType;
};

const mapToInformations = ({ statut, utilisateur, recandidature }: MapToInformationsProps) => {
  const informations: AvailableInformations = [];

  if (utilisateur.estPorteur() && statut.estAccordé()) {
    informations.push('demande-de-mainlevée');
  }

  if (recandidature) {
    informations.push('demande-abandon-pour-recandidature');
  }

  return informations;
};
