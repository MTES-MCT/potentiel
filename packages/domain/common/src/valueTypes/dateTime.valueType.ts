import { InvalidOperationError } from '@potentiel-domain/core';

export type RawType = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

export type ValueType = {
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: Date | ValueType): boolean;
  formatter(): RawType;
};

export const convertirEnValueType = (value: Date | string) => {
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
    estAntérieurÀ(dateTime: Date | ValueType) {
      return this.date.getTime() < (dateTime instanceof Date ? dateTime : dateTime.date).getTime();
    },
    formatter() {
      return this.date.toISOString() as RawType;
    },
  };
};

const regexDateISO8601 = /^[^#]+#[^#]+#[^#]+#[^#]+$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexDateISO8601.test(value);

  if (!isValid) {
    throw new DateTimeInvalideError();
  }
}

class DateTimeInvalideError extends InvalidOperationError {
  constructor() {
    super(
      `La date ne correspond pas au format ISO8601 sans décalage UTC ('{YYYY}-{MM}-{SS}T{HH}:{mm}:{ss}.{ms}Z`,
    );
  }
}
