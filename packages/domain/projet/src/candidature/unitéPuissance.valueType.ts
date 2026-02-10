import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { TypeTechnologie } from './index.js';

export type RawType = AppelOffre.UnitéPuissance;
export type ValueType = ReadonlyValueType<{
  unité: RawType;
  formatter(): RawType;
}>;

export const bind = ({ unité }: PlainType<ValueType>): ValueType => {
  return {
    unité,
    estÉgaleÀ({ unité }) {
      return this.unité === unité;
    },
    formatter() {
      return this.unité;
    },
  };
};

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return bind({ unité: value });
};

function estValide(value: string): asserts value is RawType {
  if (value !== 'MW' && value !== 'MWc') {
    throw new UnitéNonValide();
  }
}

class UnitéNonValide extends Error {
  constructor() {
    super('Unité non valide');
  }
}

type DéterminerProps = {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  technologie: TypeTechnologie.RawType;
};

export const déterminer = ({
  appelOffres,
  période: périodeId,
  technologie,
}: DéterminerProps): ValueType => {
  const getUnité = () => {
    const période = appelOffres.periodes.find((p) => p.id === périodeId);
    if (période?.unitéPuissance) {
      return période.unitéPuissance;
    }
    if (appelOffres.multiplesTechnologies) {
      if (technologie === 'N/A') {
        throw new TypeTechnologieRequisError();
      }
      return appelOffres.unitePuissance[technologie];
    }

    return appelOffres.unitePuissance;
  };
  return bind({ unité: getUnité() });
};

class TypeTechnologieRequisError extends InvalidOperationError {
  constructor() {
    super(
      `Le type de technologie ne peut pas être N/A pour un appel d'offres avec de multiples technologies`,
    );
  }
}
