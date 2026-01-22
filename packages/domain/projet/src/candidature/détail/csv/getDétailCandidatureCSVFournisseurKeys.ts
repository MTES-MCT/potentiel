import { allCandidatureCSVDetailsKeys } from '../allDétailCandidatureCSVKeys';

import {
  fournisseurAutresTechnologiesCSVDetailsKeys,
  fournisseurCellulesCSVDetailsKeys,
  fournisseurDéveloppementCSVDetailsKeys,
  fournisseurDispositifDeProductionCSVDetailsKeys,
  fournisseurDispositifDeStockageDeLEnergieCSVDetailsKeys,
  fournisseurDispositifDeSuiviDeLaCourseDuSoleilCSVDetailsKeys,
  fournisseurFournitureTransportMontageCSVDetailsKeys,
  fournisseurGenieCivilCSVDetailsKeys,
  fournisseurInstallationEtMiseEnServiceCSVDetailsKeys,
  fournisseurModulesOuFilmsCSVDetailsKeys,
  fournisseurPlaquettesDeSiliciumWafersCSVDetailsKeys,
  fournisseurPolysiliciumCSVDetailsKeys,
  fournisseurPostesDeConversionCSVDetailsKeys,
  fournisseurRaccordementCSVDetailsKeys,
  fournisseurStructureCSVDetailsKeys,
  fournisseurTurbineCSVDetailsKeys,
  fournisseurFabricationDeComposantsEtAssemblageCSVDetailsKeys,
  fournisseurTotalCSVDetailsKeys,
} from './fournisseurs';

export const getDétailCandidatureCSVFournisseurKeys = () => {
  const fournisseursCandidatureDétailKeys: Array<(typeof allCandidatureCSVDetailsKeys)[number]> =
    Array.from(
      new Set([
        ...fournisseurAutresTechnologiesCSVDetailsKeys,
        ...fournisseurCellulesCSVDetailsKeys,
        ...fournisseurDéveloppementCSVDetailsKeys,
        ...fournisseurDispositifDeProductionCSVDetailsKeys,
        ...fournisseurDispositifDeStockageDeLEnergieCSVDetailsKeys,
        ...fournisseurDispositifDeSuiviDeLaCourseDuSoleilCSVDetailsKeys,
        ...fournisseurFournitureTransportMontageCSVDetailsKeys,
        ...fournisseurGenieCivilCSVDetailsKeys,
        ...fournisseurInstallationEtMiseEnServiceCSVDetailsKeys,
        ...fournisseurModulesOuFilmsCSVDetailsKeys,
        ...fournisseurPlaquettesDeSiliciumWafersCSVDetailsKeys,
        ...fournisseurPolysiliciumCSVDetailsKeys,
        ...fournisseurPostesDeConversionCSVDetailsKeys,
        ...fournisseurRaccordementCSVDetailsKeys,
        ...fournisseurStructureCSVDetailsKeys,
        ...fournisseurTurbineCSVDetailsKeys,
        ...fournisseurFabricationDeComposantsEtAssemblageCSVDetailsKeys,
        ...fournisseurTotalCSVDetailsKeys,
      ]),
    );

  return fournisseursCandidatureDétailKeys;
};
