import { AppelOffre } from '@potentiel-domain/appel-offre';
import { PlainType } from '@potentiel-domain/core';

/** @deprecated use  AppelOffre.RéférenceCahierDesCharges.ValueType */
export type CahierDesChargesRéférenceParsed =
  PlainType<AppelOffre.RéférenceCahierDesCharges.ValueType>;

/** @deprecated use  AppelOffre.RéférenceCahierDesCharges.ValueType */
export const parseCahierDesChargesRéférence = (
  référence: string,
): CahierDesChargesRéférenceParsed =>
  AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(référence);

/** @deprecated use  AppelOffre.RéférenceCahierDesCharges.ValueType */
export const formatCahierDesChargesRéférence = (
  cdc: CahierDesChargesRéférenceParsed,
): AppelOffre.CahierDesChargesRéférence =>
  AppelOffre.RéférenceCahierDesCharges.bind(cdc).formatter();
