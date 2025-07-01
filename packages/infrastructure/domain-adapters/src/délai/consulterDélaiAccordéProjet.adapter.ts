import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { récupérerÉvénementDélaiAccordé } from './utils/récupérerÉvénementDélaiAccordé';
import { récupérerÉvénementDemandeDelaiSignaled } from './utils/récupérerÉvénementDemandeDelaiSignaled';
import { récupérerÉvénementCovidDelayGranted } from './utils/récupérerÉvénementCovidDelayGranted';
import { récupérerÉvénementProjectCompletionDueDateSetDélaiCdc2022 } from './utils/récupérerÉvénementProjectCompletionDueDateSetDélaiCdc2022';
import { récupérerÉvénementLegacyModificationRawDataImported } from './utils/récupérerÉvénementLegacyModificationRawDataImported';

export type RécupérerDélaiÉvénement = (args: {
  identifiantProjet: IdentifiantProjet.ValueType;
}) => Promise<Lauréat.Délai.ListerHistoriqueDélaiProjetReadModel>;

export const consulterDélaiAccordéProjetAdapter: Lauréat.Délai.ConsulterDélaiAccordéProjetPort =
  async (identifiantProjet: string) => {
    const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

    return [
      ...(await récupérerÉvénementDélaiAccordé({
        identifiantProjet: identifiantProjetValueType,
      })),
      ...(await récupérerÉvénementDemandeDelaiSignaled({
        identifiantProjet: identifiantProjetValueType,
      })),
      ...(await récupérerÉvénementCovidDelayGranted({
        identifiantProjet: identifiantProjetValueType,
      })),
      ...(await récupérerÉvénementProjectCompletionDueDateSetDélaiCdc2022({
        identifiantProjet: identifiantProjetValueType,
      })),
      ...(await récupérerÉvénementLegacyModificationRawDataImported({
        identifiantProjet: identifiantProjetValueType,
      })),
    ];
  };
