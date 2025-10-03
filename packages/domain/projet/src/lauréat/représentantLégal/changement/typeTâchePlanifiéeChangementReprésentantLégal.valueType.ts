import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'représentant-légal.gestion-automatique-demande-changement',
  'représentant-légal.rappel-instruction-à-deux-mois',
  'représentant-légal.suppression-document-à-trois-mois',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  estGestionAutomatiqueDemandeChangement: () => boolean;
  estRappelInstructionÀDeuxMois: () => boolean;
  estSuppressionDocumentÀTroisMois: () => boolean;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  return {
    type,
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    estGestionAutomatiqueDemandeChangement() {
      return this.type === 'représentant-légal.gestion-automatique-demande-changement';
    },
    estRappelInstructionÀDeuxMois() {
      return this.type === 'représentant-légal.rappel-instruction-à-deux-mois';
    },
    estSuppressionDocumentÀTroisMois() {
      return this.type === 'représentant-légal.suppression-document-à-trois-mois';
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
    throw new TypeTâchePlanifiéeInvalideError(value);
  }
}

export const gestionAutomatiqueDemandeChangement = convertirEnValueType(
  'représentant-légal.gestion-automatique-demande-changement',
);

export const rappelInstructionÀDeuxMois = convertirEnValueType(
  'représentant-légal.rappel-instruction-à-deux-mois',
);

export const suppressionDocumentÀTroisMois = convertirEnValueType(
  'représentant-légal.suppression-document-à-trois-mois',
);

export class TypeTâchePlanifiéeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type de tâche planifiée ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
