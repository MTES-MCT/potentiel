import { Candidature } from '../../..';

import {
  autresTechnologies,
  cellules,
  dispositifDeProduction,
  dispositifDeStockageDeLEnergie,
  dispositifDeSuiviDeLaCourseDuSoleil,
  développement,
  fabricationDeComposantsEtAssemblage,
  fournitureTransportMontage,
  genieCivil,
  installationEtMiseEnService,
  modulesOuFilms,
  plaquettesDeSiliciumWafers,
  polysilicium,
  postesDeConversion,
  raccordement,
  structure,
  total,
  turbine,
} from './fournisseurs';
export const getDétailCandidatureCSVFournisseurKeys = () => {
  const fournisseursCandidatureDétailKeys: Partial<
    Array<keyof Candidature.DétailCandidature.RawType>
  > = Array.from(
    new Set([
      ...autresTechnologies.CSVDétailKeys,
      ...cellules.CSVDétailKeys,
      ...développement.CSVDétailKeys,
      ...dispositifDeProduction.CSVDétailKeys,
      ...dispositifDeStockageDeLEnergie.CSVDétailKeys,
      ...dispositifDeSuiviDeLaCourseDuSoleil.CSVDétailKeys,
      ...fournitureTransportMontage.CSVDétailKeys,
      ...genieCivil.CSVDétailKeys,
      ...installationEtMiseEnService.CSVDétailKeys,
      ...modulesOuFilms.CSVDétailKeys,
      ...plaquettesDeSiliciumWafers.CSVDétailKeys,
      ...polysilicium.CSVDétailKeys,
      ...postesDeConversion.CSVDétailKeys,
      ...raccordement.CSVDétailKeys,
      ...structure.CSVDétailKeys,
      ...turbine.CSVDétailKeys,
      ...fabricationDeComposantsEtAssemblage.CSVDétailKeys,
      ...total.CSVDétailKeys,
    ]),
  );

  return fournisseursCandidatureDétailKeys;
};
