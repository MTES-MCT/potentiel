export type DataForStatutDemandeAbandonModifiéNotificationDTO = {
  chargeAffaire?: { email: string; fullName: string; id: string };
  nomProjet: string;
  appelOffreId: string;
  périodeId: string;
  départementProjet: string;
  porteursProjet: { email: string; fullName: string; id: string }[];
};
