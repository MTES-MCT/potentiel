import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

type AppelOffre = string;
type Période = string;

export type RawType = `${AppelOffre}#${Période}`;

export type ValueType = ReadonlyValueType<{
  appelOffre: AppelOffre;
  période: Période;
  formatter(): RawType;
}>;

export const bind = ({ appelOffre, période }: PlainType<ValueType>): ValueType => {
  return {
    appelOffre,
    période,
    formatter() {
      return `${this.appelOffre}#${this.période}`;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
  };
};

export const convertirEnValueType = (identifiantPériode: string): ValueType => {
  estValide(identifiantPériode);

  const [appelOffre, période] = identifiantPériode.split('#');

  return bind({
    appelOffre,
    période,
  });
};

const regexIdentifiantPériode = /^[^#]+#[^#]+$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexIdentifiantPériode.test(value);

  if (!isValid) {
    throw new IdentifiantPériodeInvalideError(value);
  }
}

class IdentifiantPériodeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `L'identifiant de la période ne correspond pas au format suivant: '{appel offre}#{période}'`,
      {
        value,
      },
    );
  }
}
