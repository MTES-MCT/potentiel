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
import { AnnulerAbandon } from './annuler/AnnulerAbandon';
import { ConfirmerAbandon } from './confirmer/ConfirmerAbandon';
import { DetailsAboutProjetPageTemplate } from '@/components/templates/DetailsAboutProjetPageTemplate';

type AvailableActions = Array<
  | 'demander-confirmation'
  | 'confirmer'
  | 'annuler'
  | 'accorder-avec-recandidature'
  | 'accorder-sans-recandidature'
  | 'rejeter'
>;

type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  demande: DetailDemandeAbandonProps;
  instruction: Parameters<typeof DetailInstructionAbandon>[0];
  identifiantUtilisateur: string;
  actions: AvailableActions;
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  demande,
  instruction,
  statut,
  identifiantUtilisateur,
  actions,
}) => {
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
      actions={mapToActionComponents({
        actions,
        identifiantProjet: projet.identifiantProjet,
        identifiantUtilisateur,
      })}
    />
  );
};

const mapToActionComponents = ({
  actions,
  identifiantProjet,
  identifiantUtilisateur,
}: {
  actions: AvailableActions;
  identifiantProjet: string;
  identifiantUtilisateur: string;
}) => {
  return (
    <>
      {actions.includes('demander-confirmation') && (
        <DemanderConfirmationAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('rejeter') && (
        <RejeterAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('accorder-avec-recandidature') && (
        <AccorderAbandonAvecRecandidature
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('accorder-sans-recandidature') && (
        <AccorderAbandonSansRecandidature
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('confirmer') && (
        <ConfirmerAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
      {actions.includes('annuler') && (
        <AnnulerAbandon
          identifiantProjet={identifiantProjet}
          identifiantUtilisateur={identifiantUtilisateur}
        />
      )}
    </>
  );
};
