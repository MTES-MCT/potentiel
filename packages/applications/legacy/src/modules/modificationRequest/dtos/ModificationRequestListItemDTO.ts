export const MODIFICATION_REQUEST_TYPES = [
  'actionnaire',
  'fournisseur',
  'producteur',
  'puissance',
  'delai',
  'autre',
] as const;
// Utilisé pour filtrer facilement la liste demande legacy lors de la migration
// Domaines migrés : actionnaire, puissance, producteur
export const MODIFICATION_REQUEST_TYPES_V2 = ['fournisseur', 'delai', 'autre'] as const;
export type ModificationRequestTypes = (typeof MODIFICATION_REQUEST_TYPES)[number];
export type ModificationRequestTypesV2 = (typeof MODIFICATION_REQUEST_TYPES_V2)[number];

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
  authority?: 'dreal' | 'dgec';

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
