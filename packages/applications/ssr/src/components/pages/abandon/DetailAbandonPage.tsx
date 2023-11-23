'use client';

import { AnnulerAbandonForm } from '@/components/molecules/abandon/AnnulerAbandonForm';
import { DetailDemandeAbandon } from '@/components/molecules/abandon/DetailDemandeAbandon';
import { DetailInstructionAbandon } from '@/components/molecules/abandon/DetailInstructionAbandon';
import { InstructionAbandonForm } from '@/components/molecules/abandon/InstructionAbandonForm';
import { StatutAbandonBadge } from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  demande: Parameters<typeof DetailDemandeAbandon>[0];
  instruction: Parameters<typeof DetailInstructionAbandon>[0];
  utilisateur: Parameters<typeof InstructionAbandonForm>[0]['utilisateur'];
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  demande,
  instruction,
  statut,
  utilisateur,
}) => {
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
      <>
        <DetailDemandeAbandon {...demande} />
        <div className="flex flex-col gap-6">
          {(instruction.accord || instruction.confirmation || instruction.rejet) && (
            <DetailInstructionAbandon {...instruction} />
          )}
          <InstructionAbandonForm
            utilisateur={utilisateur}
            statut={statut}
            recandidature={demande.recandidature}
            identifiantProjet={projet.identifiantProjet}
          />
        </div>
        {utilisateur.rôle === 'porteur-projet' &&
          ['demandé', 'confirmation-demandée'].includes(statut) && (
            <AnnulerAbandonForm
              identifiantProjet={projet.identifiantProjet}
              utilisateur={utilisateur}
            />
          )}
      </>
    </ProjetPageTemplate>
  );
};
