import { AppelOffre } from '@potentiel-domain/appel-offre';

export const defaultModifications: AppelOffre.RèglesModification = {
  siteDeProduction: {
    modificationAdmin: true,
  },
  représentantLégal: {
    modificationAdmin: true,
  },
  actionnaire: {
    modificationAdmin: true,
  },
  fournisseur: {
    modificationAdmin: true,
  },
  producteur: {
    modificationAdmin: true,
  },
  puissance: {
    modificationAdmin: true,
  },
  nomProjet: {},
  natureDeLExploitation: {},
  installateur: {},
  dispositifDeStockage: {},
  délai: {},
  recours: {},
  abandon: {},
};
