import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = {
  installationAvecDispositifDeStockage: boolean;
  puissanceDuDispositifDeStockageEnKw?: number;
  capacitéDuDispositifDeStockageEnKw?: number;
};

export type ValueType = ReadonlyValueType<
  RawType & {
    formatter(): RawType;
  }
>;

export const bind = ({
  installationAvecDispositifDeStockage,
  puissanceDuDispositifDeStockageEnKw,
  capacitéDuDispositifDeStockageEnKw,
}: PlainType<ValueType>): ValueType => {
  return {
    installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKw,
    capacitéDuDispositifDeStockageEnKw,
    estÉgaleÀ({
      installationAvecDispositifDeStockage,
      puissanceDuDispositifDeStockageEnKw,
      capacitéDuDispositifDeStockageEnKw,
    }) {
      return (
        this.installationAvecDispositifDeStockage === installationAvecDispositifDeStockage &&
        this.puissanceDuDispositifDeStockageEnKw === puissanceDuDispositifDeStockageEnKw &&
        this.capacitéDuDispositifDeStockageEnKw === capacitéDuDispositifDeStockageEnKw
      );
    },
    formatter() {
      return {
        installationAvecDispositifDeStockage,
        puissanceDuDispositifDeStockageEnKw,
        capacitéDuDispositifDeStockageEnKw,
      };
    },
  };
};
