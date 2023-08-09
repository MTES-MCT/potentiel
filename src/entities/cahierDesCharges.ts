import {
  CahierDesChargesRéférence,
  DateParutionCahierDesChargesModifié,
} from '@potentiel/domain-views';

export type CahierDesChargesRéférenceParsed =
  | { type: 'initial' }
  | {
      type: 'modifié';
      paruLe: DateParutionCahierDesChargesModifié;
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
    paruLe: référence.replace('-alternatif', '') as DateParutionCahierDesChargesModifié,
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  };
};

export const formatCahierDesChargesRéférence = (
  cdc: CahierDesChargesRéférenceParsed,
): CahierDesChargesRéférence =>
  cdc.type === 'initial'
    ? 'initial'
    : (`${cdc.paruLe}${cdc.alternatif ? '-alternatif' : ''}` as CahierDesChargesRéférence);
