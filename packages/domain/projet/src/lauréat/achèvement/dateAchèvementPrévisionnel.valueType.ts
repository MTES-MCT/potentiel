import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

export type RawType = DateTime.RawType;

export type ValueType = {
  dateTime: DateTime.ValueType;
  ajouterDélai: (nombreDeMois: number) => ValueType;
  retirerDélai: (nombreDeMois: number) => ValueType;
  formatter: () => DateTime.RawType;
  formatterDate: () => string;
};

export const bind = ({ dateTime: date }: PlainType<ValueType>): ValueType => {
  return convertirEnValueType(date.date);
};

const duréeInstructionEdfOaEnJours = 1;

export const convertirEnValueType = (value: Date | string): ValueType => {
  const dateSansHeure = DateTime.convertirEnValueType(
    new Date(DateTime.convertirEnValueType(value).formatterDate()),
  );

  return {
    dateTime: dateSansHeure,
    formatter() {
      return this.dateTime.formatter();
    },
    formatterDate() {
      return this.dateTime.formatterDate();
    },
    ajouterDélai(nombreDeMois) {
      const dateAvecDélai = this.dateTime
        .ajouterNombreDeMois(nombreDeMois)
        .retirerNombreDeJours(duréeInstructionEdfOaEnJours);

      return convertirEnValueType(dateAvecDélai.date);
    },
    retirerDélai(nombreDeMois) {
      const dateSansDélai = this.dateTime
        .ajouterNombreDeJours(duréeInstructionEdfOaEnJours)
        .retirerNombreDeMois(nombreDeMois);

      return convertirEnValueType(dateSansDélai.date);
    },
  };
};
