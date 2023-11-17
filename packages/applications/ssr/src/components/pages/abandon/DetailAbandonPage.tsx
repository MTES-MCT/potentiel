'use client';

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
import { FormulaireInstructionAbandon } from '@/components/molecules/abandon/FormulaireInstructionAbandon';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useSearchParams } from 'next/navigation';
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
}) => {
  const successMessage = useSearchParams().get('success');
  return (
    <ProjectPageTemplate
      retour={{ title: 'retour vers la liste', url: '/laureat/abandon/1' }}
      candidature={candidature}
      identifiantProjet={identifiantProjet}
      heading={
        <>
          <span>Abandon</span> <StatutDemandeBadge statut={statut} className="align-middle" />
        </>
      }
    >
      <>
        {successMessage && <Alert severity="success" title={successMessage} className="my-4" />}
        <DetailDemandeAbandon demande={demande} identifiantProjet={identifiantProjet} />
        <div className="flex flex-col gap-4">
          {instruction && (
            <InstructionAbandon identifiantProjet={identifiantProjet} instruction={instruction} />
          )}
          <FormulaireInstructionAbandon
            recandidature={demande.recandidature}
            statut={statut}
            utilisateur={utilisateur}
            identifiantProjet={identifiantProjet}
          />
        </div>
      </>
    </ProjectPageTemplate>
  );
};
