import { Lauréat } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql';

type GetDispositifDeStockageProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampsInstallation: keyof TDossier;
  nomChampCapacité: keyof TDossier;
  nomChampPuissance: keyof TDossier;
};

export const getDispositifDeStockage = <TDossier extends Record<string, string>>({
  accessor,
  nomChampsInstallation,
  nomChampCapacité,
  nomChampPuissance,
}: GetDispositifDeStockageProps<TDossier>): Lauréat.DispositifDeStockage.DispositifDeStockage.RawType => {
  const installationAvecDispositifDeStockage =
    accessor.getBooleanValue(nomChampsInstallation) ?? false;
  const capacitéDuDispositifDeStockageEnKWh = accessor.getNumberValue(nomChampCapacité);
  const puissanceDuDispositifDeStockageEnKW = accessor.getNumberValue(nomChampPuissance);

  return installationAvecDispositifDeStockage
    ? {
        installationAvecDispositifDeStockage,
        capacitéDuDispositifDeStockageEnKWh,
        puissanceDuDispositifDeStockageEnKW,
      }
    : { installationAvecDispositifDeStockage };
};
