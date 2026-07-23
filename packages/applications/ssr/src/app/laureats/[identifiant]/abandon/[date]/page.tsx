import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { type Candidature, type IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  DétailsAbandonPage,
  type DétailsAbandonPageProps,
} from '@/app/laureats/[identifiant]/abandon/[date]/DétailsAbandon.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { mapToAbandonTimelineItemProps } from '../(historique)/mapToAbandonTimelineItemProps';

type PageProps = { params: Promise<{ identifiant: string; date: string }> };

export const metadata: Metadata = {
  title: 'Abandon',
};

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant, date } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const demandéLe = decodeParameter(date);

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          demandéLeValue: demandéLe,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      const powerPurchaseAgreement =
        await mediator.send<Lauréat.PowerPurchaseAgreement.ConsulterPowerPurchaseAgreementQuery>({
          type: 'Lauréat.PowerPurchaseAgreement.Query.ConsulterPowerPurchaseAgreement',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        });

      const estPPA = Option.isSome(powerPurchaseAgreement);
      const ppaSignaléLorsDeLaDemande = abandon.demande.ppaSignalé;

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
          estPPA={estPPA}
          ppaSignaléLorsDeLaDemande={ppaSignaléLorsDeLaDemande}
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

type AvailableActions = DétailsAbandonPageProps['actions'];

type MapToActionsProps = {
  utilisateur: Utilisateur.ValueType;
  abandon: Lauréat.Abandon.ConsulterDemandeAbandonReadModel;
};

const mapToActions = ({
  utilisateur,
  abandon: { statut, demande },
}: MapToActionsProps): AvailableActions => {
  const actions: AvailableActions = [];
  const statutRecandidature = demande.recandidature?.statut;
  const passéEnInstructionPar = demande.instruction?.passéEnInstructionPar;

  // AUTORITÉS COMPÉTENTES
  if (
    Lauréat.Abandon.AutoritéCompétente.dgec.autoritéCompétente === utilisateur.rôle.nom ||
    Lauréat.Abandon.AutoritéCompétente.dreal.autoritéCompétente === utilisateur.rôle.nom
  ) {
    if (!demande.autoritéCompétente.estCompétent(utilisateur.rôle)) {
      return actions;
    }
  }

  // ACTIONS LIÉES À LA DEMANDE
  if (
    changementPossible(statut, 'confirmé') &&
    utilisateur.rôle.aLaPermission('abandon.confirmer')
  ) {
    actions.push('confirmer');
  }

  if (changementPossible(statut, 'annulé') && utilisateur.rôle.aLaPermission('abandon.annuler')) {
    actions.push('annuler');
  }

  if (
    statut.estAccordé() &&
    statutRecandidature?.estEnAttente() &&
    utilisateur.rôle.aLaPermission('abandon.preuve-recandidature.transmettre')
  ) {
    actions.push('transmettre-preuve-recandidature');
  }

  // ACTIONS LIÉES A L'INSTRUCTION
  if (
    demande.recandidature &&
    !utilisateur.rôle.aLaPermission('abandon.preuve-recandidature.accorder')
  ) {
    return actions;
  }

  if (
    utilisateur.rôle.aLaPermission('abandon.demander-confirmation') &&
    changementPossible(statut, 'confirmation-demandée')
  ) {
    actions.push('demander-confirmation');
  }

  if (utilisateur.rôle.aLaPermission('abandon.accorder') && changementPossible(statut, 'accordé')) {
    const avecRecandidature =
      statutRecandidature &&
      utilisateur.rôle.aLaPermission('abandon.preuve-recandidature.accorder');
    actions.push(avecRecandidature ? 'accorder-avec-recandidature' : 'accorder-sans-recandidature');
  }

  if (utilisateur.rôle.aLaPermission('abandon.rejeter') && changementPossible(statut, 'rejeté')) {
    actions.push('rejeter');
  }

  if (
    changementPossible(statut, 'en-instruction') &&
    utilisateur.rôle.aLaPermission('abandon.passer-en-instruction')
  ) {
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

type GetProjetsÀSélectionnerProps = {
  utilisateur: Utilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

const getProjetsÀSélectionner = async ({
  identifiantProjet,
  utilisateur,
}: GetProjetsÀSélectionnerProps): Promise<DétailsAbandonPageProps['projetsÀSélectionner']> => {
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
