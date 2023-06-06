import { Option } from '@potentiel/monads';

export type DossierRaccordement = {
  référence: string;
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
