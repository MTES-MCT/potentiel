import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'inconnue',
  'abandon.confirmer',
  'abandon.transmettre-preuve-recandidature',
  'raccordement.référence-non-transmise',
  'raccordement.gestionnaire-réseau-inconnu-attribué',
  'raccordement.renseigner-accusé-réception-demande-complète-raccordement',
  'raccordement.transmettre-proposition-technique-et-financière-raccordement',
  'garanties-financières.demander',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({
    type: value,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeTâcheInvalideError(value);
  }
}

export const inconnue = convertirEnValueType('inconnue');
export const abandonConfirmer = convertirEnValueType('abandon.confirmer');
export const abandonTransmettrePreuveRecandidature = convertirEnValueType(
  'abandon.transmettre-preuve-recandidature',
);
export const raccordementRéférenceNonTransmise = convertirEnValueType(
  'raccordement.référence-non-transmise',
);
export const raccordementGestionnaireRéseauInconnuAttribué = convertirEnValueType(
  'raccordement.gestionnaire-réseau-inconnu-attribué',
);
export const raccordementRenseignerAccuséRéceptionDemandeComplèteRaccordement =
  convertirEnValueType('raccordement.renseigner-accusé-réception-demande-complète-raccordement');
export const raccordementTransmettrePropositionTechniqueEtFinancièreRaccordement =
  convertirEnValueType('raccordement.transmettre-proposition-technique-et-financière-raccordement');

export const garantiesFinancièresDemander = convertirEnValueType('garanties-financières.demander');

class TypeTâcheInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
