import { DetailDemandeAbandon } from '@/components/molecules/abandon/DetailDemandeAbandon';
import { InstructionAbandon } from '@/components/molecules/abandon/InstructionAbandon';
import { StatutDemandeBadge } from '@/components/molecules/demande/StatutDemandeBadge';
import { ProjectPageTemplate } from '@/components/templates/ProjectPageTemplate';
import { FC } from 'react';

export type DetailAbandonPageProps = {
  identifiantProjet: string;
  candidature: {
    statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';
    nom: string;
    appelOffre: string;
    période: string;
    famille: string;
    localité: {
      commune: string;
      département: string;
      région: string;
      codePostal: string;
    };
    dateDésignation: string;
  };
  utilisateur: {
    rôle:
      | 'admin'
      | 'porteur-projet'
      | 'dreal'
      | 'acheteur-obligé'
      | 'ademe'
      | 'dgec-validateur'
      | 'caisse-des-dépôts'
      | 'cre';
  };
  statut:
    | 'accordé'
    | 'annulé'
    | 'confirmation-demandée'
    | 'confirmé'
    | 'demandé'
    | 'rejeté'
    | 'inconnu';
  demande: {
    demandéPar: string;
    demandéLe: string;
    recandidature: boolean;
    raison: string;
    pièceJustificativeDisponible: boolean;
  };
  confirmation?: {
    demandéLe: string;
    demandéPar: string;
    réponseSignéeDisponible: boolean;
    confirméLe?: string;
    confirméPar?: string;
  };
  accord?: { accordéPar: string; accordéLe: string; réponseSignéeDisponible: boolean };
  rejet?: { rejetéPar: string; rejetéLe: string; réponseSignéeDisponible: boolean };
};

export const DetailAbandonPage: FC<DetailAbandonPageProps> = ({
  candidature,
  identifiantProjet,
  utilisateur,
  statut,
  demande,
  confirmation,
  rejet,
  accord,
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
      {(confirmation || rejet || accord) && (
        <InstructionAbandon
          identifiantProjet={identifiantProjet}
          confirmation={confirmation}
          rejet={rejet}
          accord={accord}
        />
      )}
    </>
  </ProjectPageTemplate>
);
