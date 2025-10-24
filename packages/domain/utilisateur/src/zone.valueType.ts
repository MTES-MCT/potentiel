import { match, P } from 'ts-pattern';

import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

import { régionsZNIHorsMayotte } from './région.valueType';

export const zones = ['métropole', 'zni', 'mayotte'] as const;

export type RawType = (typeof zones)[number];

export type ValueType = ReadonlyValueType<{
  nom: RawType;
  formatter: () => RawType;
  aAccèsàLaRégion(région: string): boolean;
}>;

export const bind = ({ nom }: { nom: string }): ValueType => {
  estValide(nom);
  return {
    nom,
    formatter() {
      return this.nom;
    },
    estÉgaleÀ(value) {
      return this.nom === value.nom;
    },
    aAccèsàLaRégion(région: string): boolean {
      const zone = déterminer(région);
      return this.estÉgaleÀ(zone);
    },
  };
};

export const convertirEnValueType = (nom: string) => bind({ nom });

export const déterminer = (région: string): ValueType => {
  const zone = match(région)
    .returnType<RawType>()
    .with('Mayotte', () => 'mayotte')
    .with(P.union(...régionsZNIHorsMayotte), () => 'zni')
    .otherwise(() => 'métropole');
  return bind({ nom: zone });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (zones as readonly string[]).includes(value);

  if (!isValid) {
    throw new ZoneInvalideError(value);
  }
}

class ZoneInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super('La zone est invalide', { value });
  }
}
