import { AppelOffre } from '@potentiel-domain/appel-offre';

export type CahierDesChargesRéférenceParsed =
  | { type: 'initial' }
  | {
      type: 'modifié';
      paruLe: AppelOffre.DateParutionCahierDesChargesModifié;
      alternatif?: true;
    };

export const parseCahierDesChargesRéférence = (
  référence: string,
): CahierDesChargesRéférenceParsed => {
  if (référence === 'initial') {
    return { type: 'initial' };
  }

  return {
    type: 'modifié',
    paruLe: référence.replace('-alternatif', '') as AppelOffre.DateParutionCahierDesChargesModifié,
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  };
};

export const formatCahierDesChargesRéférence = (
  cdc: CahierDesChargesRéférenceParsed,
): AppelOffre.CahierDesChargesRéférence =>
  cdc.type === 'initial'
    ? 'initial'
    : (`${cdc.paruLe}${cdc.alternatif ? '-alternatif' : ''}` as AppelOffre.CahierDesChargesRéférence);
