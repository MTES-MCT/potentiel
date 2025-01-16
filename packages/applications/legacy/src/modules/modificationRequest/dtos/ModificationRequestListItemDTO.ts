export const MODIFICATION_REQUEST_TYPES = [
  'actionnaire',
  'fournisseur',
  'producteur',
  'puissance',
  'delai',
  'autre',
] as const;
// ce type est utilisé pour filtrer facilement la liste demande legacy
// quand des domaines sont migrés
// Migrés : "actionnaire"
export const MODIFICATION_REQUEST_TYPES_V2 = [
  'fournisseur',
  'producteur',
  'puissance',
  'delai',
  'autre',
] as const;
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
