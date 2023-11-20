import {
  DetailDemandeAbandon,
  DetailDemandeAbandonProps,
} from '@/components/molecules/abandon/DetailDemandeAbandon';
import {
  InstructionAbandon,
  InstructionAbandonProps,
} from '@/components/molecules/abandon/InstructionAbandon';
import {
  StatutDemandeBadge,
  StatutDemandeBadgeProps,
} from '@/components/molecules/demande/StatutDemandeBadge';
import { ProjectPageTemplate } from '@/components/templates/ProjectPageTemplate';
import { Candidature } from '@/utils/Candidature';
import { Utilisateur } from '@/utils/Utilisateur';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  identifiantProjet: string;
  utilisateur: Utilisateur;
  candidature: Candidature;
  statut: StatutDemandeBadgeProps['statut'];
} & DetailDemandeAbandonProps &
  InstructionAbandonProps;

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  candidature,
  identifiantProjet,
  utilisateur,
  statut,
  demande,
  instruction,
}) => (
  <ProjectPageTemplate
    candidature={candidature}
    identifiantProjet={identifiantProjet}
    retour={{ title: 'retour vers la liste', url: '/laureat/abandon/1' }}
    heading={
      <>
        <span>Abandon</span> <StatutDemandeBadge statut={statut} className="align-middle" />
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
