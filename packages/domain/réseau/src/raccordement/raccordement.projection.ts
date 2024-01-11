import { DateTime } from '@potentiel-domain/common';
import { Projection } from '@potentiel-libraries/projection';
import * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';

// TODO: Doit on doit vraiment nommé les entités avec Projection, sachant que cela indique qu'on fait de l'ES dans l'infrastructure ???
export type RaccordementProjection = Projection<
  'raccordemement',
  {
    référence: RéférenceDossierRaccordement.RawType;
    dateQualification?: DateTime.RawType;
    propositionTechniqueEtFinancière?: {
      dateSignature: DateTime.RawType;
      format: string;
    };
    dateMiseEnService?: DateTime.RawType;
    accuséRéception?: { format: string };
  }
>;
