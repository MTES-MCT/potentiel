import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType = {
  installationAvecDispositifDeStockage: boolean;
  puissanceDuDispositifDeStockageEnKW?: number;
  capacitéDuDispositifDeStockageEnKWh?: number;
};

export type ValueType = ReadonlyValueType<
  RawType & {
    formatter(): RawType;
  }
>;

export const bind = ({
  installationAvecDispositifDeStockage,
  puissanceDuDispositifDeStockageEnKW,
  capacitéDuDispositifDeStockageEnKWh,
}: PlainType<ValueType>): ValueType => {
  estValide({
    installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKWh,
  });
  return {
    installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKWh,
    estÉgaleÀ({
      installationAvecDispositifDeStockage,
      puissanceDuDispositifDeStockageEnKW,
      capacitéDuDispositifDeStockageEnKWh,
    }) {
      return (
        this.installationAvecDispositifDeStockage === installationAvecDispositifDeStockage &&
        this.puissanceDuDispositifDeStockageEnKW === puissanceDuDispositifDeStockageEnKW &&
        this.capacitéDuDispositifDeStockageEnKWh === capacitéDuDispositifDeStockageEnKWh
      );
    },
    formatter() {
      return {
        installationAvecDispositifDeStockage,
        puissanceDuDispositifDeStockageEnKW,
        capacitéDuDispositifDeStockageEnKWh,
      };
    },
  };
};

function estValide(value: {
  installationAvecDispositifDeStockage: boolean;
  puissanceDuDispositifDeStockageEnKW?: number;
  capacitéDuDispositifDeStockageEnKWh?: number;
}): asserts value is RawType {
  const isInvalidWithDispositifDeStockage =
    value.installationAvecDispositifDeStockage &&
    (!value.capacitéDuDispositifDeStockageEnKWh || !value.puissanceDuDispositifDeStockageEnKW);

  const isInvalidWithoutDispositifDeStockage =
    !value.installationAvecDispositifDeStockage &&
    (value.capacitéDuDispositifDeStockageEnKWh || value.puissanceDuDispositifDeStockageEnKW);

  if (isInvalidWithDispositifDeStockage) {
    throw new InstallationAvecDispositifDeStockageError();
  }
  if (isInvalidWithoutDispositifDeStockage) {
    throw new InstallationSansDispositifDeStockageInvalidError();
  }
}

class InstallationAvecDispositifDeStockageError extends InvalidOperationError {
  constructor() {
    super(`La capacité et la puissance du dispositif de stockage sont requises`);
  }
}

class InstallationSansDispositifDeStockageInvalidError extends InvalidOperationError {
  constructor() {
    super(
      `La capacité et la puissance du dispositif de stockage ne peuvent être renseignées en l'absence de dispositif de stockage`,
    );
  }
}
