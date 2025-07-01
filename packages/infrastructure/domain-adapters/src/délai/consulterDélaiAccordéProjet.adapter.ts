import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import {
  récupérerÉvénementDélaiAccordé,
  récupérerÉvénementDemandeDelaiSignaled,
  récupérerÉvénementCovidDelayGranted,
  récupérerÉvénementProjectCompletionDueDateSetDélaiCdc2022,
  récupérerÉvénementLegacyModificationRawDataImported,
} from './utils';

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
