import { ReadonlyValueType, InvalidOperationError } from '@potentiel-domain/core';
import { differenceInMonths } from 'date-fns';

export type RawType = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

export type ValueType = ReadonlyValueType<{
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: ValueType): boolean;
  estUltérieureÀ(dateTime: ValueType): boolean;
  nombreMoisÉcartAvec(dateTime: ValueType): number;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: Date | string): ValueType => {
  let date: Date | undefined;

  if (typeof value === 'string') {
    estValide(value);
    date = new Date(value);
  } else {
    date = value;
  }

  return {
    date,
    estDansLeFutur() {
      return this.date.getTime() > Date.now();
    },
    estAntérieurÀ(dateTime: ValueType) {
      return this.date.getTime() < dateTime.date.getTime();
    },
    estUltérieureÀ(dateTime: ValueType) {
      return this.date.getTime() > dateTime.date.getTime();
    },
    formatter() {
      return this.date.toISOString() as RawType;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
    nombreMoisÉcartAvec(dateTime) {
      const écart = differenceInMonths(this.date, dateTime.date);
      return Math.abs(écart); // Peu importe si la date est avant ou aprés, on veut l'écart positif.
    },
  };
};

export const now = () => convertirEnValueType(new Date());

const regexDateISO8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?Z$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexDateISO8601.test(value);

  if (!isValid) {
    throw new DateTimeInvalideError(value);
  }
}

class DateTimeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `La date ne correspond pas au format ISO8601 sans décalage UTC ('{YYYY}-{MM}-{SS}T{HH}:{mm}:{ss}.{ms}Z`,
      {
        value,
      },
    );
  }
}
