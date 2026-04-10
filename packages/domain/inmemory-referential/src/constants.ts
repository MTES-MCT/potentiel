import { AppelOffre } from '@potentiel-domain/appel-offre';

export const defaultModifications: AppelOffre.RèglesMiseÀJour['modification'] = {
  siteDeProduction: true,
  représentantLégal: true,
  actionnaire: true,
  fournisseur: true,
  producteur: true,
  puissance: true,
  nomProjet: undefined,
  natureDeLExploitation: undefined,
  installateur: undefined,
  dispositifDeStockage: undefined,
  typologieInstallation: undefined,
  délai: undefined,
  recours: undefined,
  abandon: undefined,
};
