import { ExpressionRegulière } from '@potentiel-domain/common';
import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

type LatitudeCardinal = 'N' | 'S';
type LongitudeCardinal = 'E' | 'O';

export type StringRawType = string; // e.g., "43° 17' 47.4" N, 5° 22' 11.52" E"

export type DecimalRawType = {
  latitude: number;
  longitude: number;
};

// degrés Minutes Secondes (with decimal secondes for precision)
type DMSRawType = {
  degrés: number;
  minutes: number;
  secondes: number; // decimal secondes for full precision
  cardinal: 'N' | 'S' | 'E' | 'O';
};

export type ValueType = ReadonlyValueType<{
  latitude: number;
  longitude: number;
  formatter(): StringRawType;
  formatterDecimal(): DecimalRawType;
  toDMS(): [DMSRawType, DMSRawType];
}>;

export const bind = ({ latitude, longitude }: PlainType<ValueType>): ValueType => {
  if (!estValide({ latitude, longitude })) {
    throw new CoordonnéesInvalidesError();
  }
  return {
    latitude,
    longitude,
    toDMS() {
      const latcardinal: LatitudeCardinal = this.latitude >= 0 ? 'N' : 'S';
      const longcardinal: LongitudeCardinal = this.longitude >= 0 ? 'E' : 'O';
      const lat = { ...fromDecimal(this.latitude), cardinal: latcardinal };
      const lon = { ...fromDecimal(this.longitude), cardinal: longcardinal };
      return [lat, lon];
    },
    estÉgaleÀ({ latitude, longitude }) {
      return this.latitude === latitude && this.longitude === longitude;
    },
    formatter() {
      const [lat, lon] = this.toDMS();
      // Format secondes with up to 4 decimal places, removing trailing zeros
      const formatSecondes = (secondes: number) => {
        const formatted = secondes.toFixed(4).replace(/\.?0+$/, '');
        return formatted;
      };
      return `${lat.degrés}° ${lat.minutes}' ${formatSecondes(lat.secondes)}" ${lat.cardinal as LatitudeCardinal}, ${lon.degrés}° ${lon.minutes}' ${formatSecondes(lon.secondes)}" ${lon.cardinal as LongitudeCardinal}`;
    },
    formatterDecimal() {
      return {
        latitude,
        longitude,
      };
    },
  };
};

export const expressionRégulière = ExpressionRegulière.convertirEnValueType(
  '(\\d+)°\\s*(\\d+)\'\\s*([\\d.]+)"\\s*([NS]),\\s*(\\d+)°\\s*(\\d+)\'\\s*([\\d.]+)"\\s*([EO])',
);

const estValide = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const convertirEnValueType = (value: string): ValueType => {
  const result = expressionRégulière.regex().exec(value);
  if (!result) {
    throw new CoordonnéesInvalidesError();
  }
  const latitudeParts = result.slice(1, 5);
  const longitudeParts = result.slice(5, 9);

  return bind({
    latitude: toDecimal({
      degrés: +latitudeParts[0],
      minutes: +latitudeParts[1],
      secondes: +latitudeParts[2],
      cardinal: latitudeParts[3] as LatitudeCardinal,
    }),
    longitude: toDecimal({
      degrés: +longitudeParts[0],
      minutes: +longitudeParts[1],
      secondes: +longitudeParts[2],
      cardinal: longitudeParts[3] as LatitudeCardinal,
    }),
  });
};

export const toDecimal = (value: DMSRawType): number => {
  const { degrés, minutes, secondes, cardinal } = value;
  const sign = cardinal === 'S' || cardinal === 'O' ? -1 : 1;
  const result = sign * (degrés + minutes / 60 + secondes / 3600);
  return Math.round(result * 1000000) / 1000000; // Round to 6 decimal places for high precision
};

export const fromDecimal = (value: number): Omit<DMSRawType, 'cardinal'> => {
  const degrés = Math.floor(Math.abs(value));
  const minutes = Math.floor((Math.abs(value) - degrés) * 60);
  const secondes = ((Math.abs(value) - degrés) * 60 - minutes) * 60;
  // Round to 4 decimal places to handle floating point precision
  return { degrés, minutes, secondes: Math.round(secondes * 10000) / 10000 };
};

export class CoordonnéesInvalidesError extends Error {
  constructor() {
    super('Les coordonnées sont invalides');
  }
}
