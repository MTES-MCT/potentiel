'use client';

import { FC } from 'react';
import { DetailDemandeAbandon } from '@/components/molecules/abandon/DetailDemandeAbandon';
import { DetailInstructionAbandon } from '@/components/molecules/abandon/DetailInstructionAbandon';
import { StatutAbandonBadge } from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { DemanderConfirmationAbandon } from './demander/DemanderConfirmationAbandon';
import { RejeterAbandon } from './rejeter/RejeterAbandon';
import { AccorderAbandonAvecRecandidature } from './accorder/AccorderAbandonAvecRecandidature';
import { AccorderAbandonSansRecandidature } from './accorder/AccorderAbandonSansRecandidature';
import { Utilisateur } from '@/utils/getUtilisateur';
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';

export type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  demande: Parameters<typeof DetailDemandeAbandon>[0];
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
    <ProjetPageTemplate
      projet={projet}
      heading={
        <div className="flex flex-row gap-3 items-center">
          <span>Abandon</span>
          <StatutAbandonBadge statut={statut} />
        </div>
      }
    >
      <div className="flex flex-col justify-center items-center md:items-start md:flex-row md:gap-6">
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <DetailDemandeAbandon {...demande} />
        </div>
        <div className="w-full md:w-1/4 flex flex-col gap-4">
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
            ) : !demande.recandidature ? (
              <AccorderAbandonSansRecandidature
                identifiantProjet={projet.identifiantProjet}
                utilisateur={utilisateur}
              />
            ) : null
          ) : null}
          {porteur.annuler ? (
            <AnnulerAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          ) : null}
          {porteur.confirmer ? (
            <ConfirmerAbandon
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          ) : null}
        </div>
      </div>
      {(instruction.accord || instruction.confirmation || instruction.rejet) && (
        <div className="mt-6">
          <DetailInstructionAbandon {...instruction} />
        </div>
      )}
    </ProjetPageTemplate>
  );
};
