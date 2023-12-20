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
import { DetailsAboutProjetPageTemplate } from '@/components/templates/ProjetDetailsPageTemplate';

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

  return (
    <DetailsAboutProjetPageTemplate
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
      actions={
        <>
          {admin.demanderConfirmation && (
            <DemanderConfirmationAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
          {admin.rejeter && (
            <RejeterAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
          {admin.accorder ? (
            demande.recandidature ? (
              <AccorderAbandonAvecRecandidature
                identifiantProjet={projet.identifiantProjet}
                utilisateur={utilisateur}
              />
            ) : (
              <AccorderAbandonSansRecandidature
                identifiantProjet={projet.identifiantProjet}
                utilisateur={utilisateur}
              />
            )
          ) : null}
          {porteur.confirmer && (
            <ConfirmerAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
          {porteur.annuler && (
            <AnnulerAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
        </>
      }
    />
  );
};
