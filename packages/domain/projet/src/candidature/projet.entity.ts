import { DateTime, Email } from '@potentiel-domain/common';

export type ProjetEntity = {
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nom: string;
  localité: {
    adresse: string;
    commune: string;
    département: string;
    région: string;
    codePostal: string;
  };
  potentielIdentifier: string;
  nomReprésentantLégal: string;
  nomCandidat: string;
  email: Email.RawType;
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
