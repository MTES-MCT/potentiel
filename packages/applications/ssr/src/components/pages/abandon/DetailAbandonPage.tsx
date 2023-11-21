import { DetailDemandeAbandon } from '@/components/molecules/abandon/DetailDemandeAbandon';
import { DetailInstructionAbandon } from '@/components/molecules/abandon/DetailInstructionAbandon';
import { StatutAbandonBadge } from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  demande: Parameters<typeof DetailDemandeAbandon>[0];
  instruction: Parameters<typeof DetailInstructionAbandon>[0];
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  projet,
  demande,
  instruction,
  statut,
}) => (
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
      {(instruction.accord || instruction.confirmation || instruction.rejet) && (
        <DetailInstructionAbandon {...instruction} />
      )}
    </>
  </ProjetPageTemplate>
);
