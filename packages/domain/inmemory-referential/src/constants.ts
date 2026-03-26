import { AppelOffre } from '@potentiel-domain/appel-offre';

export const defaultModifications: AppelOffre.RèglesDemandes['modification'] = {
  siteDeProduction: true,
  représentantLégal: true,
  actionnaire: true,
  fournisseur: true,
  producteur: true,
  puissance: true,
  nomProjet: 'indisponible',
  natureDeLExploitation: 'indisponible',
  installateur: 'indisponible',
  dispositifDeStockage: 'indisponible',
  typologieInstallation: 'indisponible',
  délai: 'indisponible',
  recours: 'indisponible',
  abandon: 'indisponible',
};
