import { InvalidOperationError } from '@potentiel-domain/core';

export type RawType = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

export type ValueType = Readonly<{
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: Date | ValueType): boolean;
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
    estAntérieurÀ(dateTime: Date | ValueType) {
      return this.date.getTime() < (dateTime instanceof Date ? dateTime : dateTime.date).getTime();
    },
    formatter() {
      return this.date.toISOString() as RawType;
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
