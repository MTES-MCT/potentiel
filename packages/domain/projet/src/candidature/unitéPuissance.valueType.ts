import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { TypeTechnologie } from '.';

export type RawType = AppelOffre.UnitéPuissance;
export type ValueType = ReadonlyValueType<{
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  technologie: TypeTechnologie.RawType;

  formatter(): RawType;
}>;

export const bind = ({ appelOffres, période, technologie }: PlainType<ValueType>): ValueType => {
  return {
    appelOffres: appelOffres as AppelOffre.AppelOffreReadModel,
    période,
    technologie,
    estÉgaleÀ({ appelOffres, période, technologie }) {
      return (
        this.appelOffres.id === appelOffres.id &&
        this.période === période &&
        this.technologie === technologie
      );
    },
    formatter() {
      const période = this.appelOffres.periodes.find((p) => p.id === this.période);
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
    },
  };
};

class TypeTechnologieRequisError extends InvalidOperationError {
  constructor() {
    super(
      `Le type de technologie ne peut pas être N/A pour un appel d'offres avec de multiples technologies`,
    );
  }
}
