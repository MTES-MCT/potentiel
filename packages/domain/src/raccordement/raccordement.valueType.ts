import { Option } from '@potentiel/monads';

export type RéférenceDossierRaccordement = {
  référence: string;
  estÉgaleÀ: (référenceDossierRaccordement: RéférenceDossierRaccordement) => boolean;
  formatter: () => string;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnRéférenceDossierRaccordement = (
  valeur: string,
): RéférenceDossierRaccordement => ({
  référence: valeur,
  estÉgaleÀ({ référence }: RéférenceDossierRaccordement) {
    return this.référence === référence;
  },
  formatter() {
    return this.référence;
  },
});

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
