export type ModificationRequestInfoForStatusNotificationDTO = {
  porteursProjet: { email: string; fullName: string; id: string }[];
  departementProjet: string;
  regionProjet: string;
  nomProjet: string;
  type: string;
  autorité: 'dgec' | 'dreal';
  appelOffreId: string;
  périodeId: string;
};
