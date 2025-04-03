import { DateTime } from '@potentiel-domain/common';
import { Entity } from '@potentiel-domain/entity';

import { RatioChangementPuissance, StatutChangementPuissance } from '..';

type DemandeChangementPuissanceEnregistré = {
  raison?: string;
  pièceJustificative?: {
    format: string;
  };
};

type DemandeChangementPuissance = {
  autoritéCompétente: RatioChangementPuissance.AutoritéCompétente;
  raison: string;
  pièceJustificative: {
    format: string;
  };

  accord?: {
    réponseSignée: {
      format: string;
    };
    accordéePar: string;
    accordéeLe: DateTime.RawType;
  };

  rejet?: {
    réponseSignée: {
      format: string;
    };
    rejetéePar: string;
    rejetéeLe: DateTime.RawType;
  };
};

export type ChangementPuissanceEntity = Entity<
  'changement-puissance',
  {
    identifiantProjet: string;

    demande: {
      nouvellePuissance: number;
      statut: StatutChangementPuissance.RawType;
      demandéePar: string;
      demandéeLe: DateTime.RawType;
    } & (DemandeChangementPuissanceEnregistré | DemandeChangementPuissance);
  }
>;
