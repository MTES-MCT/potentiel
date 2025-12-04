import { match } from 'ts-pattern';

export const categoriesDisponibles = [
  'abandon',
  'achevement',
  'actionnaire',
  'délai',
  'fournisseur',
  'garanties-financieres',
  'lauréat',
  'éliminé',
  'producteur',
  'puissance',
  'recours',
  'représentant-légal',
  'raccordement',
  'installation',
  'nature-de-l-exploitation',
] as const;

export const mapCatégoriesToLabel = (catégorie: (typeof categoriesDisponibles)[number]) =>
  match(catégorie)
    .with('abandon', () => 'Abandon')
    .with('achevement', () => 'Achèvement')
    .with('actionnaire', () => 'Actionnaire')
    .with('délai', () => 'Délai')
    .with('fournisseur', () => 'Fournisseur')
    .with('garanties-financieres', () => 'Garanties financières')
    .with('installation', () => 'Installation (typologie, stockage, installateur)')
    .with('lauréat', () => 'Nom et Site de production')
    .with('nature-de-l-exploitation', () => "Nature de l'exploitation")
    .with('producteur', () => 'Producteur')
    .with('puissance', () => 'Puissance')
    .with('raccordement', () => 'Raccordement')
    .with('recours', () => 'Recours')
    .with('représentant-légal', () => 'Représentant légal')
    .with('éliminé', () => 'Éliminé')
    .exhaustive();
