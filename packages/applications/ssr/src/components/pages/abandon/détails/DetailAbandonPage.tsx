'use client';

import { FC } from 'react';
import {
  DetailDemandeAbandon,
  DetailDemandeAbandonProps,
} from '@/components/molecules/abandon/DetailDemandeAbandon';
import { DetailInstructionAbandon } from '@/components/molecules/abandon/DetailInstructionAbandon';
import { StatutAbandonBadge } from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { DemanderConfirmationAbandon } from './demanderConfirmation/DemanderConfirmationAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { Utilisateur } from '@/utils/getUtilisateur';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { ProjetDetailsPageTemplate } from '@/components/templates/ProjetDetailsPageTemplate';
import { demanderConfirmationAbandonAction } from './demanderConfirmation/demanderConfirmation.action';
import { rejeterAbandonAction } from './rejeter/rejeterAbandon.action';
import { accorderAbandonAvecRecandidatureAction } from './accorder/accorderAbandonAvecRecandidature.action';
import { accorderAbandonSansRecandidatureAction } from './accorder/accorderAbandonSansRecandidature.action';
import { confirmerAbandonAction } from './confirmer/confirmerAbandon.action';
import { annulerAbandonAction } from './annuler/annulerAbandon.action';

export type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  demande: DetailDemandeAbandonProps;
  instruction: Parameters<typeof DetailInstructionAbandon>[0];
  utilisateur: Utilisateur;
};

const getActionsDisponible = ({
  utilisateur,
  demande,
  statut,
}: {
  utilisateur: DetailAbandonPageProps['utilisateur'];
  demande: DetailAbandonPageProps['demande'];
  statut: DetailAbandonPageProps['statut'];
}) => {
  const rolePorteur = utilisateur.rôle === 'porteur-projet';
  const instructionEnCours = !['accordé', 'rejeté'].includes(statut);

  const réponsePermise =
    utilisateur.rôle === 'dgec-validateur' ||
    (utilisateur.rôle === 'admin' && !demande.recandidature);
  const demandeConfirmationPossible = statut === 'demandé' && !demande.recandidature;

  return {
    admin: {
      demanderConfirmation: instructionEnCours && réponsePermise && demandeConfirmationPossible,
      rejeter: instructionEnCours && réponsePermise,
      accorder: instructionEnCours && réponsePermise,
    },
    porteur: {
      annuler: rolePorteur && ['demandé', 'confirmation-demandée'].includes(statut),
      confirmer: rolePorteur && statut === 'confirmation-demandée',
    },
  };
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  demande,
  instruction,
  statut,
  utilisateur,
}) => {
  const { admin, porteur } = getActionsDisponible({
    utilisateur,
    demande,
    statut,
  });

  const actions: Parameters<typeof ProjetDetailsPageTemplate>[0]['actions'] = [
    ...(admin.demanderConfirmation
      ? [
          {
            name: 'Demander la confirmation',
            description: "Demander la confirmation de l'abandon",
            form: {
              id: 'demande-confirmation-abandon-form',
              action: demanderConfirmationAbandonAction,
              children: (
                <DemanderConfirmationAbandon
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ),
            },
          },
        ]
      : []),
    ...(admin.rejeter
      ? [
          {
            name: 'Rejeter',
            description: "Rejeter l'abandon",
            form: {
              id: 'rejeter-abandon-form',
              action: rejeterAbandonAction,
              children: (
                <RejeterAbandon
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ),
            },
          },
        ]
      : []),
    ...(admin.accorder
      ? [
          {
            name: 'Accorder',
            description: "Accorder l'abandon",
            form: {
              id: 'accorder-abandon-form',
              action: demande.recandidature
                ? accorderAbandonAvecRecandidatureAction
                : accorderAbandonSansRecandidatureAction,
              children: demande.recandidature ? (
                <AccorderAbandonAvecRecandidature
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ) : (
                <AccorderAbandonSansRecandidature
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ),
            },
          },
        ]
      : []),
    ...(porteur.confirmer
      ? [
          {
            name: 'Confirmer',
            description: "Confirmer l'abandon",
            form: {
              id: 'confirmer-abandon-form',
              action: confirmerAbandonAction,
              children: (
                <ConfirmerAbandon
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ),
            },
          },
        ]
      : []),
    ...(porteur.annuler
      ? [
          {
            name: 'Annuler',
            description: "Annuler l'abandon",
            form: {
              id: 'annuler-abandon-form',
              action: annulerAbandonAction,
              children: (
                <AnnulerAbandon
                  identifiantProjet={projet.identifiantProjet}
                  utilisateur={utilisateur}
                />
              ),
            },
          },
        ]
      : []),
  ];

  return (
    <ProjetDetailsPageTemplate
      projet={projet}
      heading={
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <span>Abandon</span>
          <StatutAbandonBadge statut={statut} />
        </div>
      }
      details={
        <>
          <DetailDemandeAbandon {...{ ...demande, statut }} />
          {(instruction.accord || instruction.confirmation || instruction.rejet) && (
            <div className="mt-6">
              <DetailInstructionAbandon {...instruction} />
            </div>
          )}
        </>
      }
      actions={actions}
    />
  );
};
