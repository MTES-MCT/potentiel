export type LegacyModificationStatus = 'acceptée' | 'rejetée' | 'accord-de-principe';

export type LegacyDelai = {
  type: 'delai';
} & (
  | {
      status: Extract<LegacyModificationStatus, 'acceptée'>;
      nouvelleDateLimiteAchevement: number;
      ancienneDateLimiteAchevement: number;
    }
  | { status: Extract<LegacyModificationStatus, 'rejetée' | 'accord-de-principe'> }
);

export type LegacyActionnaire = {
  type: 'actionnaire';
  actionnairePrecedent: string;
  siretPrecedent: string;
};
export type LegacyProducteur = {
  type: 'producteur';
  producteurPrecedent: string;
};

export type LegacyAutre = {
  type: 'autre';
  column: string;
  value: string;
};

export type LegacyVariant =
  | LegacyDelai
  | LegacyActionnaire
  | LegacyProducteur
  | LegacyAutre;

export type LegacyModificationDTO = {
  modifiedOn: number;
  modificationId: string;
  filename?: string;
  status: LegacyModificationStatus;
} & LegacyVariant;
