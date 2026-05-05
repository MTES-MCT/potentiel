import { Entity } from '@potentiel-domain/entity';

import { IdentifiantProjet } from '../../index.js';

export type DétailFournisseursCandidatureEntity = Entity<
  'détail-fournisseurs-candidature',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    fournisseurs: Array<{
      typeFournisseur: string;
      nomDuFabricant?: string;
      lieuDeFabrication?: string;
      coûtTotalLot?: string;
      contenuLocalFrançais?: string;
      contenuLocalEuropéen?: string;
      technologie?: string;
      puissanceCrêteWc?: string;
      rendementNominal?: string;
      référenceCommerciale?: string;
    }>;
  }
>;
