import { IdentifiantProjet } from '@potentiel-domain/common';

export type RawType = `recours|${IdentifiantProjet.RawType}`;

export type ValueType = {
  formatter(): RawType;
};

export const convertirEnValueType = (value: string): ValueType => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(value);
  return {
    formatter() {
      return `recours|${identifiantProjet.formatter()}`;
    },
  };
};
