import { Lauréat } from '@potentiel-domain/projet';
import { FieldToExempleMapper, mapBoolean, mapNumber } from '../../../../helpers/mapToExemple';

export const DispositifDeStockageExempleMap: FieldToExempleMapper<Lauréat.InstallationAvecDispositifDeStockage.DispositifDeStockage.RawType> =
  {
    installationAvecDispositifDeStockage: ['installation avec dispositif de stockage', mapBoolean],
    capacitéDuDispositifDeStockageEnKw: ['capacité du dispositif', mapNumber],
    puissanceDuDispositifDeStockageEnKw: ['puissance du dispositif', mapNumber],
  };
