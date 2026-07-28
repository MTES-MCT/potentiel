import { createDossierAccessor, type GetDossierQuery } from '../../graphql/index.js';

export const getDateConstitutionGarantiesFinancières = (
  champs: GetDossierQuery['dossier']['champs'],
) => {
  const accessor = createDossierAccessor(champs, {
    dateConsignation: 'Date de la consignation',
    dateDélibérationExemption: `Date de la délibération portant sur le projet objet de l'offre`,
    datePriseEffet: `Date de prise d'effet de la garantie financière d'exécution`,
    datePriseEffet2: `Date de la garantie financière d'exécution`,
  } as Record<string, string>);

  const dateConsignation = accessor.getDateValue('dateConsignation');
  const dateDélibérationExemption = accessor.getDateValue('dateDélibérationExemption');
  const datePriseEffet = accessor.getDateValue('datePriseEffet');
  const datePriseEffet2 = accessor.getDateValue('datePriseEffet2');

  return dateConsignation ?? dateDélibérationExemption ?? datePriseEffet ?? datePriseEffet2;
};
