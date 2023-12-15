export type ProjectInfoForModificationReceivedNotificationDTO = {
  porteursProjet: { email: string; fullName: string; id: string }[];
  departementProjet: string;
  regionProjet: string;
  nomProjet: string;
  evaluationCarboneDeRéférence: number;
  puissanceInitiale: number;
  cahierDesChargesActuel: string;
  technologie: 'N/A' | 'pv' | 'eolien' | 'hydraulique';
  appelOffreId: string;
  periodeId: string;
  familleId?: string;
};
