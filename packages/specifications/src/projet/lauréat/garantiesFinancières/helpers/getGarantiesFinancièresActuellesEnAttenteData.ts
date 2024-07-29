export const defaultGarantiesFinancièresActuellesEnAttenteData = {
  notifiéLe: '2024-01-01',
  dateLimiteSoumission: '2024-01-03',
  motif: 'motif-inconnu',
};

export type GarantiesFinancièresActuellesEnAttenteExempleData = {
  'date de notification'?: string;
  'date limite de soumission'?: string;
  motif?: string;
};

export const getGarantiesFinancièresActuellesEnAttenteData = (
  exemple: GarantiesFinancièresActuellesEnAttenteExempleData,
) => ({
  demandéLeValue: new Date(
    exemple['date de notification'] ?? defaultGarantiesFinancièresActuellesEnAttenteData.notifiéLe,
  ).toISOString(),
  dateLimiteSoumissionValue: new Date(
    exemple['date limite de soumission'] ??
      defaultGarantiesFinancièresActuellesEnAttenteData.dateLimiteSoumission,
  ).toISOString(),
  motifValue: exemple['motif'] ?? defaultGarantiesFinancièresActuellesEnAttenteData.motif,
});
