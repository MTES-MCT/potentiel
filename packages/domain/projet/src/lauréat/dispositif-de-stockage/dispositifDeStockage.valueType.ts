import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = {
  installationAvecDispositifDeStockage: boolean;
  puissanceDuDispositifDeStockageEnKW?: number;
  capacitéDuDispositifDeStockageEnKW?: number;
};

export type ValueType = ReadonlyValueType<
  RawType & {
    formatter(): RawType;
  }
>;

export const bind = ({
  installationAvecDispositifDeStockage,
  puissanceDuDispositifDeStockageEnKW,
  capacitéDuDispositifDeStockageEnKW,
}: PlainType<ValueType>): ValueType => {
  return {
    installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKW,
    estÉgaleÀ({
      installationAvecDispositifDeStockage,
      puissanceDuDispositifDeStockageEnKW,
      capacitéDuDispositifDeStockageEnKW,
    }) {
      return (
        this.installationAvecDispositifDeStockage === installationAvecDispositifDeStockage &&
        this.puissanceDuDispositifDeStockageEnKW === puissanceDuDispositifDeStockageEnKW &&
        this.capacitéDuDispositifDeStockageEnKW === capacitéDuDispositifDeStockageEnKW
      );
    },
    formatter() {
      return {
        installationAvecDispositifDeStockage,
        puissanceDuDispositifDeStockageEnKW,
        capacitéDuDispositifDeStockageEnKW,
      };
    },
  };
};
