import { ProjectAppelOffre, parseCahierDesChargesRéférence } from '../../../../../entities';
import { CahierDesChargesRéférence, Technologie } from '@potentiel/domain-views';

const defaultRatios = { min: 0.9, max: 1.1 };

export const getRatiosChangementPuissance = (project: {
  cahierDesChargesActuel: CahierDesChargesRéférence;
  appelOffre?: ProjectAppelOffre;
  technologie: Technologie;
}): { min: number; max: number } => {
  const { appelOffre, technologie, cahierDesChargesActuel } = project;

  if (!appelOffre) {
    return defaultRatios;
  }

  const {
    changementPuissance,
    periode: { cahiersDesChargesModifiésDisponibles },
  } = appelOffre;

  const cahierDesChargesActuelParsed = parseCahierDesChargesRéférence(cahierDesChargesActuel);

  const cdcActuelInclusCdcModifiésDisponible = cahiersDesChargesModifiésDisponibles.find(
    (cdc) =>
      cdc.type === cahierDesChargesActuelParsed.type &&
      cdc.paruLe === cahierDesChargesActuelParsed.paruLe &&
      cdc.alternatif === cahierDesChargesActuelParsed.alternatif,
  );

  if (
    cdcActuelInclusCdcModifiésDisponible &&
    cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance
  ) {
    if (
      cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance
        .changementByTechnologie
    ) {
      if (technologie === 'N/A') {
        return defaultRatios;
      }

      return cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance.ratios[
        technologie
      ];
    }

    return cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance.ratios;
  }

  if (changementPuissance.changementByTechnologie) {
    if (technologie === 'N/A') {
      return defaultRatios;
    }

    return changementPuissance.ratios[technologie];
  }

  return changementPuissance.ratios;
};
