import { differenceInDays, addMonths } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

import { ReadonlyValueType, InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { Iso8601DateTime, regexDateISO8601 } from '@potentiel-libraries/iso8601-datetime';

export type RawType = Iso8601DateTime;

export type ValueType = ReadonlyValueType<{
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: ValueType): boolean;
  estUltérieureÀ(dateTime: ValueType): boolean;
  nombreJoursÉcartAvec(dateTime: ValueType): number;
  ajouterNombreDeJours(nombreDeJours: number): ValueType;
  retirerNombreDeJours(nombreDeMois: number): ValueType;
  ajouterNombreDeMois(nombreDeMois: number): ValueType;
  retirerNombreDeMois(nombreDeMois: number): ValueType;
  formatter(): RawType;
  /** Retourne la date au format YYYY-MM-DD */
  formatterDate(): string;
}>;

export const bind = ({ date }: PlainType<ValueType>): ValueType => {
  return convertirEnValueType(date);
};

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
    formatterDate() {
      return this.date.toISOString().split('T')[0];
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
    nombreJoursÉcartAvec(dateTime) {
      const écart = differenceInDays(this.date, dateTime.date);
      return Math.abs(écart); // Peu importe si la date est avant ou aprés, on veut l'écart positif.
    },
    ajouterNombreDeJours(nombreDeJours) {
      const nouvelleDate = new Date(this.date);
      nouvelleDate.setDate(nouvelleDate.getDate() + nombreDeJours);
      return convertirEnValueType(nouvelleDate);
    },
    retirerNombreDeJours(nombreDeJours) {
      return this.ajouterNombreDeJours(-nombreDeJours);
    },
    ajouterNombreDeMois(nombreDeMois) {
      const utcDate = new UTCDate(this.date);
      const avecNombreDeMoisAjouté = addMonths(utcDate, nombreDeMois);

      return convertirEnValueType(avecNombreDeMoisAjouté);
    },
    retirerNombreDeMois(nombreDeMois) {
      return this.ajouterNombreDeMois(-nombreDeMois);
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
      `La date ne correspond pas au format ISO8601 sans décalage UTC ('{YYYY}-{MM}-{SS}T{HH}:{mm}:{ss}.{ms}Z')`,
      {
        value,
      },
    );
  }
}
