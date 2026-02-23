import { Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

type StatistiqueConnexion = {
  type: 'connexionUtilisateur';
  données: {
    utilisateur: {
      role: Role.RawType;
      email: Email.RawType;
    };
    provider: string;
  };
};

type StatistiqueExport = {
  type: 'exportCsv';
  données: {
    typeExport: 'dossierRaccordement' | 'lauréatEnrichi' | 'éliminéEnrichi' | 'détailsFournisseur';
    utilisateur: {
      role: Role.RawType;
      email: Email.RawType;
    };
    nombreLignes: number;
    filtres?: Record<string, string | string[]>;
  };
};

export type StatistiqueUtilisation = StatistiqueConnexion | StatistiqueExport;
