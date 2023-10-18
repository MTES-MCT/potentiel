export type RawType = string;

export type PlainType = {
  date: Date;
};

export type ValueType = PlainType & {
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: PlainType): boolean;
  formatter(): string;
};

export const convertirEnValueType = (value: RawType | PlainType) => {
  return {
    date: estUnPlainType(value) ? value.date : new Date(value),
    estDansLeFutur() {
      return this.date.getTime() > Date.now();
    },
    estAntérieurÀ(dateTime: PlainType) {
      return this.date.getTime() < dateTime.date.getTime();
    },
    formatter() {
      return this.date.toISOString();
    },
  };
};

const estUnPlainType = (value: any): value is PlainType => {
  return value.date && value.date instanceof Date;
};
