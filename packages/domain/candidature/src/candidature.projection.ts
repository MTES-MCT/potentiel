import { DateTime, StatutProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type CandidatureProjection = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: StatutProjet.RawType;
  nom: string;
  localité: {
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
};
