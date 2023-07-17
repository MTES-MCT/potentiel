export type ProjectInfoForModificationReceivedNotificationDTO = {
  porteursProjet: { email: string; fullName: string; id: string }[];
  departementProjet: string;
  regionProjet: string;
  nomProjet: string;
  evaluationCarboneDeRéférence: number;
};
