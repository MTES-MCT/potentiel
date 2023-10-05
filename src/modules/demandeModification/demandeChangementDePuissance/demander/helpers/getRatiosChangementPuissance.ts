import { CahierDesChargesRéférenceParsed, ProjectAppelOffre } from '../../../../../entities';
import { Technologie } from '@potentiel/domain-views';

const defaultRatios = { min: 0.9, max: 1.1 };

export const getRatiosChangementPuissance = (project: {
  cahierDesChargesActuel: CahierDesChargesRéférenceParsed;
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

  const cdcActuelInclusCdcModifiésDisponible = cahiersDesChargesModifiésDisponibles.find(
    (cdc) =>
      cdc.type === cahierDesChargesActuel.type &&
      cdc.paruLe === cahierDesChargesActuel.paruLe &&
      cdc.alternatif === cahierDesChargesActuel.alternatif,
  );

  if (
    cdcActuelInclusCdcModifiésDisponible &&
    cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance
  ) {
    if (
      cdcActuelInclusCdcModifiésDisponible.seuilSupplémentaireChangementPuissance
        .changementByTechnologie
    ) {
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
