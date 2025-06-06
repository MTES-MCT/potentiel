import { Candidature } from '@potentiel-domain/projet';

export type ProjectInfoForModificationReceivedNotificationDTO = {
  porteursProjet: { email: string; fullName: string; id: string }[];
  departementProjet: string;
  regionProjet: string;
  nomProjet: string;
  evaluationCarboneDeRéférence: number;
  puissanceInitiale: number;
  cahierDesChargesActuel: string;
  technologie: Candidature.TypeTechnologie.RawType;
  appelOffreId: string;
  periodeId: string;
  familleId?: string;
};
