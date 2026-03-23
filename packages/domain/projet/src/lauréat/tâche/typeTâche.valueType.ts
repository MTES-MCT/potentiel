import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'inconnue',
  'abandon.confirmer',
  'abandon.transmettre-preuve-recandidature',
  'raccordement.référence-non-transmise',
  'raccordement.gestionnaire-réseau-inconnu-attribué',
  'raccordement.renseigner-accusé-réception-demande-complète-raccordement',
  'garanties-financières.demander',
] as const;

export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter: () => Type;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(type);
  return {
    get type() {
      return type as Type;
    },
    formatter() {
      return this.type;
    },
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(value: string) => {
  estValide(value);
  return bind<Type>({
    type: value,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeTâcheInvalideError(value);
  }
}

export const inconnue = convertirEnValueType<'inconnue'>('inconnue');
export const abandonConfirmer = convertirEnValueType<'abandon.confirmer'>('abandon.confirmer');
export const abandonTransmettrePreuveRecandidature =
  convertirEnValueType<'abandon.transmettre-preuve-recandidature'>(
    'abandon.transmettre-preuve-recandidature',
  );
export const raccordementRéférenceNonTransmise =
  convertirEnValueType<'raccordement.référence-non-transmise'>(
    'raccordement.référence-non-transmise',
  );
export const raccordementGestionnaireRéseauInconnuAttribué =
  convertirEnValueType<'raccordement.gestionnaire-réseau-inconnu-attribué'>(
    'raccordement.gestionnaire-réseau-inconnu-attribué',
  );
export const raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement =
  convertirEnValueType<'raccordement.renseigner-accusé-réception-demande-complète-raccordement'>(
    'raccordement.renseigner-accusé-réception-demande-complète-raccordement',
  );

export const garantiesFinancièresDemander = convertirEnValueType<'garanties-financières.demander'>(
  'garanties-financières.demander',
);

class TypeTâcheInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
