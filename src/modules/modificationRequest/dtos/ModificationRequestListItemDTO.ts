export type ModificationRequestTypes =
  | 'actionnaire'
  | 'fournisseur'
  | 'producteur'
  | 'puissance'
  | 'recours'
  | 'abandon'
  | 'delai'
  | 'annulation abandon'
  | 'autre';

export type ModificationRequestStatusDTO =
  | 'envoyée'
  | 'acceptée'
  | 'rejetée'
  | 'annulée'
  | 'en instruction'
  | 'en attente de confirmation'
  | 'demande confirmée'
  | 'information validée';

export type ModificationRequestListItemDTO = {
  id: string;
  type: ModificationRequestTypes;
  status: string;
  description: string;
  authority: 'dreal' | 'dgec';

  requestedOn: number;
  requestedBy: {
    email: string;
    fullName: string;
  };

  attachmentFile: {
    filename: string;
    id: string;
  };

  project: {
    appelOffreId: string;
    periodeId: string;
    familleId: string | undefined;
    nomProjet: string;
    communeProjet: string;
    departementProjet: string;
    regionProjet: string;
    unitePuissance: string;
  };
};
