export type RawType = string;

export type PlainType = {
  email: string;
};

export type ValueType = PlainType & {
  formatter: () => RawType;
};

export const convertirEnValueType = (value: RawType | PlainType): ValueType => {
  return {
    email: estUnPlainType(value) ? value.email : value,
    formatter() {
      return this.email;
    },
  };
};

const estUnPlainType = (value: any): value is PlainType => {
  return value.email && typeof value.email === 'string';
};
