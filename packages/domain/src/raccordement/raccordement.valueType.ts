import { Option } from '@potentiel/monads';
import { Readable } from 'stream';

export type RawRéférenceDossierRaccordement = string;

export type RéférenceDossierRaccordement = {
  référence: string;
  estÉgaleÀ: (référenceDossierRaccordement: RéférenceDossierRaccordement) => boolean;
  formatter: () => RawRéférenceDossierRaccordement;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnRéférenceDossierRaccordement = (
  référenceDossierRaccordement:
    | string
    | Omit<RéférenceDossierRaccordement, 'formatter' | 'estÉgaleÀ'>,
): RéférenceDossierRaccordement => {
  return {
    référence:
      typeof référenceDossierRaccordement === 'string'
        ? référenceDossierRaccordement
        : référenceDossierRaccordement.référence,
    estÉgaleÀ({ référence }: RéférenceDossierRaccordement) {
      return this.référence === référence;
    },
    formatter() {
      return this.référence;
    },
  };
};

export type DossierRaccordement = {
  référence: RéférenceDossierRaccordement;
  demandeComplèteRaccordement: {
    dateQualification: Option<Date>;
    format: Option<string>;
  };
  miseEnService: {
    dateMiseEnService: Option<Date>;
  };
  propositionTechniqueEtFinancière: {
    dateSignature: Option<Date>;
    format: Option<string>;
  };
};

export type AccuséRéceptionDemandeComplèteRaccordement = {
  format: string;
  content: Readable;
};

export type PropositionTechniqueEtFinancièreSignée = {
  format: string;
  content: Readable;
};
