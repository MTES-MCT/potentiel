import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type ProjetEntity = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.RawType;
  nom: string;
  localité: {
    adresse: string;
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  potentielIdentifier: string;
  nomReprésentantLégal: IdentifiantUtilisateur.RawType;
  nomCandidat: string;
  email: IdentifiantUtilisateur.RawType;
  dateDésignation: DateTime.RawType;
  puissance: number;
  cahierDesCharges: string;
  adressePostaleCandidat: string;
  technologie?: string;

  isInvestissementParticipatif: boolean;
  isFinancementParticipatif: boolean;
  actionnariat?: string;
  evaluationCarbone: number;
  engagementFournitureDePuissanceAlaPointe: boolean;
  motifsElimination: string;
  prixReference: number;
};
