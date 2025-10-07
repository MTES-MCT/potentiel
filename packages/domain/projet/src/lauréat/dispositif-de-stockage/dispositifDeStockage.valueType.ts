import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

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
  estValide({
    installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKW,
  });
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

function estValide(value: {
  installationAvecDispositifDeStockage: boolean;
  puissanceDuDispositifDeStockageEnKW?: number;
  capacitéDuDispositifDeStockageEnKW?: number;
}): asserts value is RawType {
  const isInvalidWithDispositifDeStockage =
    value.installationAvecDispositifDeStockage &&
    (!value.capacitéDuDispositifDeStockageEnKW || !value.puissanceDuDispositifDeStockageEnKW);

  const isInvalidWithoutDispositifDeStockage =
    !value.installationAvecDispositifDeStockage &&
    (value.capacitéDuDispositifDeStockageEnKW || value.puissanceDuDispositifDeStockageEnKW);

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
