import {
  DetailDemandeAbandon,
  DetailDemandeAbandonProps,
} from '@/components/molecules/abandon/DetailDemandeAbandon';
import {
  InstructionAbandon,
  InstructionAbandonProps,
} from '@/components/molecules/abandon/InstructionAbandon';
import { StatutAbandonBadge } from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  statut: Parameters<typeof StatutAbandonBadge>[0]['statut'];
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
} & DetailDemandeAbandonProps &
  InstructionAbandonProps;

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
      <DetailDemandeAbandon demande={demande} identifiantProjet={projet.identifiantProjet} />
      {instruction && (
        <InstructionAbandon
          identifiantProjet={projet.identifiantProjet}
          instruction={instruction}
        />
      )}
    </>
  </ProjetPageTemplate>
);
