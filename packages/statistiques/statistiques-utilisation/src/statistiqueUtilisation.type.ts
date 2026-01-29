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
  type:
    | 'exportDossierRaccordement'
    | 'exportLauréatEnrichi'
    | 'exportÉliminéEnrichi'
    | 'exportDétailsFournisseur';
  données: {
    utilisateur: {
      role: Role.RawType;
    };
    filtres?: Record<string, string | string[]>;
  };
};

export type StatistiqueUtilisation = StatistiqueConnexion | StatistiqueExport;
