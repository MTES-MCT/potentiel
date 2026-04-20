import { differenceInDays, addMonths, subMonths, addHours, addMilliseconds } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

import { ReadonlyValueType, InvalidOperationError, PlainType } from '@potentiel-domain/core';
import { Iso8601DateTime, regexDateISO8601 } from '@potentiel-libraries/iso8601-datetime';

export type RawType = Iso8601DateTime;

export type ValueType = ReadonlyValueType<{
  date: Date;
  estPassée(): boolean;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: ValueType): boolean;
  estUltérieureÀ(dateTime: ValueType): boolean;
  estDansIntervalle(intervalle: { min: ValueType; max: ValueType }): boolean;
  nombreJoursÉcartAvec(dateTime: ValueType): number;
  ajouterNombreDeJours(nombreDeJours: number): ValueType;
  retirerNombreDeJours(nombreDeMois: number): ValueType;
  ajouterNombreDeMois(nombreDeMois: number): ValueType;
  retirerNombreDeMois(nombreDeMois: number): ValueType;
  ajouterNombreDeMillisecondes(nombreDeMillisecondes: number): ValueType;
  définirHeureÀMidi(): ValueType;
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
    estValideString(value);
    date = new Date(value);
  } else {
    date = value;
  }
  estValideDate(date);

  return {
    date,
    estPassée() {
      return this.date.getTime() < Date.now();
    },
    estDansLeFutur() {
      return this.date.getTime() > Date.now();
    },
    estAntérieurÀ(dateTime: ValueType) {
      return this.date.getTime() < dateTime.date.getTime();
    },
    estUltérieureÀ(dateTime: ValueType) {
      return this.date.getTime() > dateTime.date.getTime();
    },
    estDansIntervalle(intervalle: { min: ValueType; max: ValueType }) {
      if (
        this.estÉgaleÀ(intervalle.min) ||
        this.estÉgaleÀ(intervalle.max) ||
        (this.estUltérieureÀ(intervalle.min) && this.estAntérieurÀ(intervalle.max))
      ) {
        return true;
      }

      return false;
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
      const utcDate = new UTCDate(this.date);
      const avecNombreDeMoisRetiré = subMonths(utcDate, nombreDeMois);

      return convertirEnValueType(avecNombreDeMoisRetiré);
    },
    définirHeureÀMidi() {
      const dateÀMidi = addHours(new Date(this.formatterDate()), 12);
      return convertirEnValueType(dateÀMidi);
    },
    ajouterNombreDeMillisecondes(nombreDeMillisecondes) {
      const utcDate = new UTCDate(this.date);
      const avecNombreDeMillisecondesAjouté = addMilliseconds(utcDate, nombreDeMillisecondes);
      return convertirEnValueType(avecNombreDeMillisecondesAjouté);
    },
  };
};

export const now = () => convertirEnValueType(new Date());

function estValideString(value: string): asserts value is RawType {
  const isValid = regexDateISO8601.test(value);

  if (!isValid) {
    throw new DateTimeInvalideError(value);
  }
}

function estValideDate(value: Date) {
  if (isNaN(value.getTime())) {
    throw new ValeurDateTimeInvalideError();
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

class ValeurDateTimeInvalideError extends InvalidOperationError {
  constructor() {
    super(`La date a une valeur invalide`);
  }
}
