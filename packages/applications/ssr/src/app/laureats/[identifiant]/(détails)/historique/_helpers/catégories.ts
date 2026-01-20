import { IconProps } from '@/components/atoms/Icon';

const DEMANDE_GENERIQUE_ICONE = 'ri-draft-line';

const catégoriesToLabelMap = {
  abandon: ['Abandon', 'ri-logout-box-line'],
  achevement: ['Achèvement', 'ri-verified-badge-line'],
  actionnaire: ['Actionnaire', DEMANDE_GENERIQUE_ICONE],
  délai: ['Délai', 'ri-time-line'],
  fournisseur: ['Fournisseur', DEMANDE_GENERIQUE_ICONE],
  'garanties-financieres': ['Garanties financières', 'ri-bank-line'],
  installation: ['Installation (typologie, stockage, installateur)', DEMANDE_GENERIQUE_ICONE],
  lauréat: ['Nom et Site de production', 'ri-notification-3-line'],
  'nature-de-l-exploitation': ["Nature de l'exploitation", DEMANDE_GENERIQUE_ICONE],
  producteur: ['Producteur', DEMANDE_GENERIQUE_ICONE],
  puissance: ['Puissance', 'ri-flashlight-line'],
  raccordement: ['Raccordement', 'ri-plug-line'],
  recours: ['Recours', 'ri-scales-3-line'],
  'représentant-légal': ['Représentant légal', DEMANDE_GENERIQUE_ICONE],
  éliminé: ['Éliminé', 'ri-notification-3-line'],
} satisfies Record<string, [string, IconProps['id']]>;

type Catégorie = keyof typeof catégoriesToLabelMap;

export const categoriesDisponibles = Object.keys(catégoriesToLabelMap) as Catégorie[];
export const mapCatégorieToLabel = (catégorie: Catégorie) => catégoriesToLabelMap[catégorie][0];
export const mapCatégorieToIcon = (catégorie: Catégorie) => catégoriesToLabelMap[catégorie][1];
