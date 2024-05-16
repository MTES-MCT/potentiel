import { ReadonlyValueType, InvalidOperationError } from '@potentiel-domain/core';
import { Iso8601DateTime, regexDateISO8601 } from '@potentiel-libraries/iso8601-datetime';
import { differenceInDays } from 'date-fns';

export type RawType = Iso8601DateTime;

export type ValueType = ReadonlyValueType<{
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: ValueType): boolean;
  estUltérieureÀ(dateTime: ValueType): boolean;
  nombreJoursÉcartAvec(dateTime: ValueType): number;
  ajouterNombreDeMois(nombreDeMois: number): Date;
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
    nombreJoursÉcartAvec(dateTime) {
      const écart = differenceInDays(this.date, dateTime.date);
      return Math.abs(écart); // Peu importe si la date est avant ou aprés, on veut l'écart positif.
    },
    ajouterNombreDeMois(nombreDeMois) {
      return new Date(this.date.setMonth(this.date.getMonth() + nombreDeMois));
    },
  };
};

export const now = () => convertirEnValueType(new Date());

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
