import { IdentifiantProjet } from '@potentiel-domain/common';

export type RawType = `abandon|${IdentifiantProjet.RawType}`;

export type ValueType = {
  formatter(): RawType;
};

export const convertirEnValueType = (value: string): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(value);
  return {
    formatter() {
      return `abandon|${identifiantProjet.formatter()}`;
    },
  };
};
