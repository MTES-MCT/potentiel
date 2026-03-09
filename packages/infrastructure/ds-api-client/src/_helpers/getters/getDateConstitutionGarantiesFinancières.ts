import { createDossierAccessor, GetDossierQuery } from '../../graphql/index.js';

import { getTypeGarantiesFinancières } from './getTypeGarantiesFinancières.js';

const gfDateLabels = {
  exemption: "Date de la délibération portant sur le projet objet de l'offre",
  exécution: "Date de la garantie financière d'exécution",
} as const;

export const getDateConstitutionGarantiesFinancières = (
  typeGarantiesFinancieres: ReturnType<typeof getTypeGarantiesFinancières>,
  champs: GetDossierQuery['dossier']['champs'],
) => {
  if (!typeGarantiesFinancieres) return undefined;

  const accessor = createDossierAccessor(champs, {
    dateConstitutionGf:
      typeGarantiesFinancieres === 'exemption'
        ? gfDateLabels['exemption']
        : gfDateLabels['exécution'],
  } as Record<'dateConstitutionGf', string>);

  return accessor.getDateValue('dateConstitutionGf');
};
