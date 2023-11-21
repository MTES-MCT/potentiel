import {
  DetailDemandeAbandon,
  DetailDemandeAbandonProps,
} from '@/components/molecules/abandon/DetailDemandeAbandon';
import {
  InstructionAbandon,
  InstructionAbandonProps,
} from '@/components/molecules/abandon/InstructionAbandon';
import {
  StatutAbandonBadge,
  StatutAbandonBadgeProps,
} from '@/components/molecules/abandon/StatutAbandonBadge';
import { ProjectPageTemplate } from '@/components/templates/ProjectPageTemplate';
import { Candidature } from '@/utils/Candidature';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  identifiantProjet: string;
  candidature: Candidature;
  statut: StatutAbandonBadgeProps['statut'];
} & DetailDemandeAbandonProps &
  InstructionAbandonProps;

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  candidature,
  identifiantProjet,
  statut,
  demande,
  instruction,
}) => (
  <ProjectPageTemplate
    candidature={candidature}
    identifiantProjet={identifiantProjet}
    heading={
      <>
        <span>Abandon</span> <StatutAbandonBadge statut={statut} className="align-middle" />
      </>
    }
  >
    <>
      <DetailDemandeAbandon demande={demande} identifiantProjet={identifiantProjet} />
      {instruction && (
        <InstructionAbandon identifiantProjet={identifiantProjet} instruction={instruction} />
      )}
    </>
  </ProjectPageTemplate>
);
