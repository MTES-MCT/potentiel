import { createDossierAccessor, GetDossierQuery } from '../../graphql/index.js';

import { getTypeGarantiesFinancières } from './getTypeGarantiesFinancières.js';

const gfDateLabels = {
  exemption: "Date de la délibération portant sur le projet objet de l'offre",
  consignation: 'Date de la consignation',
  'avec-date-échéance': "Date de prise d'effet de la garantie financière",
} as const;

export const getDateConstitutionGarantiesFinancières = (
  typeGarantiesFinancieres: ReturnType<typeof getTypeGarantiesFinancières>,
  champs: GetDossierQuery['dossier']['champs'],
) => {
  if (!typeGarantiesFinancieres) return undefined;

  const label = gfDateLabels[typeGarantiesFinancieres];
  if (!label) return undefined;

  const accessor = createDossierAccessor(champs, { dateConstitutionGf: label } as Record<
    'dateConstitutionGf',
    string
  >);

  return accessor.getDateValue('dateConstitutionGf');
};
