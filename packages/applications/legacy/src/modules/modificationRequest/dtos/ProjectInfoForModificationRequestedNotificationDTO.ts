export type ProjectInfoForModificationRequestedNotificationDTO = {
  porteursProjet: { email: string; fullName: string; id: string }[];
  departementProjet: string;
  regionProjet: string;
  nomProjet: string;
  appelOffreId: string;
  périodeId: string;
};
